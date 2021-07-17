import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { cookieConfig } from '../../utils/constants';

const setCookie = (reply: FastifyReply, sid: string) => {
  reply.cookie('sid', sid, cookieConfig);
};

export const createSession = async (uid: string, reply: FastifyReply) => {
  const session = await prisma.session.findFirst({
    where: {
      userId: uid,
    },
  });

  if (session) {
    setCookie(reply, session.id);
  }

  const newSession = await prisma.session.create({
    data: {
      user: {
        connect: {
          id: uid,
        },
      },
    },
  });

  setCookie(reply, newSession.id);

  return session;
};

export const getUser = async (request: FastifyRequest) => {
  const sid = request.unsignCookie(request.cookies.sid).value;

  if (!sid) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sid,
    },
  });

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

  return user;
};

export const destroySession = async (sid: string, reply: FastifyReply) => {
  await prisma.session.delete({
    where: {
      id: sid,
    },
  });

  reply.clearCookie('sid');
};
