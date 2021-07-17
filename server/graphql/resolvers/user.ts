import { hash, verify } from 'argon2';
import {
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import { createSession, destroySession, getUser } from '../auth/session';
import { Comment } from './comment';
import { Post } from './post';
import { prisma } from '../../lib/prisma';
import { validate } from '../../utils/validate';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('email');
    t.nonNull.string('username');
    t.nonNull.field('posts', {
      type: nonNull(list(Post)),
      resolve: async (user) => {
        const posts = await prisma.user
          .findUnique({
            where: {
              id: user.id,
            },
          })
          .posts();

        return posts;
      },
    });
    t.nonNull.field('comments', {
      type: nonNull(list(Comment)),
      resolve: async (user) => {
        const comments = await prisma.user
          .findUnique({
            where: {
              id: user.id,
            },
          })
          .comments();

        return comments;
      },
    });
  },
});

export const me = queryField('me', {
  type: User,
  resolve: async (_, __, { request }) => {
    const user = await getUser(request);
    return user;
  },
});

export const register = mutationField('register', {
  type: nonNull(User),
  args: {
    email: nonNull(stringArg()),
    username: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  resolve: async (_, args, { reply }) => {
    validate(args);

    const { email, password, username } = args;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error('Email or username already taken');
    }

    const hashed = await hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
      },
    });

    await createSession(user.id, reply);

    return user;
  },
});

export const login = mutationField('login', {
  type: nonNull(User),
  args: {
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  resolve: async (_, args, { reply }) => {
    validate(args);

    const { email, password } = args;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Email does not exist in the database');
    }

    const match = await verify(user.password, password);

    if (!match) {
      throw new Error('Wrong password');
    }

    await createSession(user.id, reply);

    return user;
  },
});

export const logout = mutationField('logout', {
  type: nonNull('Boolean'),
  resolve: async (_, __, { request, reply }) => {
    const sid = request.unsignCookie(request.cookies.sid).value;
    try {
      await destroySession(sid!, reply);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
});
