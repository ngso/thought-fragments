import React from 'react';
import { GetServerSideProps } from 'next';
import { AllPostsDocument, useAllPostsQuery } from '../generated/graphql';
import { initializeApollo } from '../lib/apollo';
import PostSnippet from '../components/PostSnippet';

const Home: React.FC = () => {
  const { data, loading } = useAllPostsQuery();

  if (loading) return <div>loading...</div>;

  return (
    <main className="flex flex-col items-center w-full">
      {data!.allPosts.map((post) => {
        return (
          <PostSnippet
            key={post!.id}
            id={post!.id}
            author={post!.user.username}
            title={post!.title}
          />
        );
      })}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const client = initializeApollo();

  await client.query({
    query: AllPostsDocument,
  });

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
  };
};

export default Home;
