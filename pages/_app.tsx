import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Demo social media application built with Next.js, Fastify and GraphQL"
        />
        <title>SocialQL</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
