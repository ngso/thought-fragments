import { prisma } from '../../lib/prisma';
import { FastifyRequest } from 'fastify';
import { getUser } from './session';

export const commentAuth = async (request: FastifyRequest, id: string) => {
  const user = await getUser(request);

  if (!user) {
    throw new Error('You are not logged in');
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
  });

  if (!comment) {
    throw new Error('Comment does not exist');
  }

  if (comment.userId !== user.id) {
    throw new Error('You do not have the permission');
  }
};
