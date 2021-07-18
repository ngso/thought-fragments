import fastify from 'fastify';
import cookie from 'fastify-cookie';
import { ApolloServer } from 'apollo-server-fastify';
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import next from 'next';
import { schema } from './graphql/schema';
import { dev } from './utils/constants';

const app = next({ dev });
const handle = app.getRequestHandler();

const main = async () => {
  await app.prepare();

  const server = fastify();

  server.register(cookie, {
    secret: process.env.COOKIE_SECRET!,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ request, reply }) => ({ request, reply }),
    plugins: [
      !dev
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await apolloServer.start();

  server.register(
    apolloServer.createHandler({
      path: '/api/graphql',
      cors: false,
    })
  );

  if (dev) {
    server.get('/_next/*', async (req, reply) => {
      await handle(req.raw, reply.raw);
      reply.sent = true;
    });
  }

  server.all('/*', async (request, reply) => {
    await handle(request.raw, reply.raw);
    reply.sent = true;
  });

  server.setNotFoundHandler(async (request, reply) => {
    await app.render404(request.raw, reply.raw);
    reply.sent = true;
  });

  const port = process.env.PORT || 3000;
  await server.listen(port, '0.0.0.0');
  console.log(`Listening on port ${port}`);
};

main().catch(console.log);
