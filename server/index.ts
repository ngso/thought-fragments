import fastify from 'fastify';
import cookie from 'fastify-cookie';
import next from 'next';
import { dev } from '../utils/constants';

const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev });
const handle = app.getRequestHandler();

const main = async () => {
  await app.prepare();

  const server = fastify();

  server.register(cookie, {
    secret: process.env.COOKIE_SECRET!,
  });

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

  await server.listen(port);
  console.log(`Listening on port ${port}`);
};

main().catch(console.log);