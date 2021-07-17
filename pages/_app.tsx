import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useApollo } from '../lib/apollo';
import '../styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const client = useApollo(pageProps.initialApolloState);

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Demo social media application built with Next.js, Fastify and GraphQL"
        />
        <title>SocialQL</title>
      </Head>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
};

export default MyApp;
