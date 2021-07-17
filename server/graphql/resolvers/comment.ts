import { mutationField, nonNull, objectType, stringArg } from 'nexus';
import { commentAuth } from '../auth/commentAuth';
import { getUser } from '../auth/session';
import { Post } from './post';
import { User } from './user';
import { prisma } from '../../lib/prisma';
import { validate } from '../../utils/validate';

export const Comment = objectType({
  name: 'Comment',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('body');
    t.nonNull.field('user', {
      type: nonNull(User),
      resolve: async (comment) => {
        const user = await prisma.comment
          .findUnique({
            where: {
              id: comment.id,
            },
          })
          .user();

        if (!user) {
          throw new Error();
        }

        return user;
      },
    });
    t.nonNull.field('post', {
      type: nonNull(Post),
      resolve: async (comment) => {
        const post = await prisma.comment
          .findUnique({
            where: {
              id: comment.id,
            },
          })
          .post();

        if (!post) {
          throw new Error();
        }

        return post;
      },
    });
  },
});

export const newComment = mutationField('newComment', {
  type: nonNull(Comment),
  args: {
    postId: nonNull(stringArg()),
    body: nonNull(stringArg()),
  },
  resolve: async (_, args, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw new Error('You are not logged in');
    }

    validate(args);

    const { postId, body } = args;

    const newComment = await prisma.comment.create({
      data: {
        body,
        post: {
          connect: { id: postId },
        },
        user: {
          connect: { id: user.id },
        },
      },
    });

    return newComment;
  },
});

export const deleteComment = mutationField('deleteComment', {
  type: nonNull('Boolean'),
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_, { id }, { request }) => {
    await commentAuth(request, id);

    try {
      await prisma.comment.deleteMany({
        where: {
          id,
        },
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
});
