import { prisma } from '../../lib/prisma';
import { FastifyRequest } from 'fastify';
import { getUser } from './session';

export const postAuth = async (request: FastifyRequest, id: string) => {
  const user = await getUser(request);

  if (!user) {
    throw new Error('You are not logged in');
  }

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    throw new Error('Post does not exist');
  }

  if (post.userId !== user.id) {
    throw new Error('You do not have the permission');
  }

  return post;
};
