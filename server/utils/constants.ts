import { CookieSerializeOptions } from 'fastify-cookie';

export const dev = process.env.NODE_ENV !== 'production';
export const cookieConfig: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365 * 10,
  sameSite: 'lax',
  secure: !dev,
  signed: true,
};
