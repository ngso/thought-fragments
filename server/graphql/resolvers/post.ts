import {
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import validator from 'validator';
import { postAuth } from '../auth/postAuth';
import { getUser } from '../auth/session';
import { Comment } from './comment';
import { User } from './user';
import { prisma } from '../../lib/prisma';
import { validate } from '../../utils/validate';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('title');
    t.nonNull.string('body');
    t.nonNull.field('user', {
      type: nonNull(User),
      resolve: async (post) => {
        const user = await prisma.post
          .findUnique({
            where: {
              id: post.id,
            },
          })
          .user();

        if (!user) {
          throw new Error();
        }

        return user;
      },
    });
    t.nonNull.field('comments', {
      type: nonNull(list(Comment)),
      resolve: async (post) => {
        const comments = await prisma.post
          .findUnique({
            where: {
              id: post.id,
            },
          })
          .comments();

        return comments;
      },
    });
  },
});

export const allPosts = queryField('allPosts', {
  type: nonNull(list(Post)),
  resolve: async () => {
    const posts = await prisma.post.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return posts;
  },
});

export const post = queryField('post', {
  type: Post,
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_, { id }) => {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    return post;
  },
});

export const newPost = mutationField('newPost', {
  type: nonNull(Post),
  args: {
    title: nonNull(stringArg()),
    body: nonNull(stringArg()),
  },
  resolve: async (_, args, { request }) => {
    const user = await getUser(request);

    if (!user) {
      throw new Error('You are not logged in');
    }

    validate(args);

    const { title, body } = args;

    const newPost = await prisma.post.create({
      data: {
        body,
        title,
        user: {
          connect: { id: user.id },
        },
      },
    });

    return newPost;
  },
});

export const updatePost = mutationField('updatePost', {
  type: nonNull(Post),
  args: {
    id: nonNull(stringArg()),
    title: stringArg(),
    body: stringArg(),
  },
  resolve: async (_, { id, title, body }, { request }) => {
    const post = await postAuth(request, id);

    if (!title || validator.isEmpty(title)) {
      title = post.title;
    }

    if (!body || validator.isEmpty(body)) {
      body = post.body;
    }

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        body,
      },
    });

    return updatedPost;
  },
});

export const deletePost = mutationField('deletePost', {
  type: nonNull('Boolean'),
  args: {
    id: nonNull(stringArg()),
  },
  resolve: async (_, { id }, { request }) => {
    await postAuth(request, id);

    try {
      await prisma.post.delete({
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
