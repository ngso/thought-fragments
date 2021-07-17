import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Comment from '../../../components/Comment';
import NewComment from '../../../components/NewComment';
import {
  PostDocument,
  useMeQuery,
  usePostQuery,
} from '../../../generated/graphql';
import { initializeApollo } from '../../../lib/apollo';

const PostPage = () => {
  const router = useRouter();

  const { pid } = router.query;

  const { data, loading } = usePostQuery({ variables: { id: pid as string } });
  const { data: meData, loading: meLoading } = useMeQuery();

  if (loading) return <div>loading...</div>;

  if (!data?.post) {
    return <div>Post does not exist</div>;
  }

  return (
    <main className="flex flex-col items-center w-full">
      <div className="bg-white w-11/12 max-w-3xl my-4 p-8 rounded-md">
        <h1 className="font-extrabold text-2xl sm:text-3xl mb-6">
          {data!.post!.title}
        </h1>
        <div className="mb-4">
          <p className="font-bold">{data!.post.user.username}</p>
        </div>
        <div>{data!.post.body}</div>
      </div>

      {meData?.me && !meLoading ? <NewComment postId={data!.post.id} /> : null}

      {data!.post.comments.map((comment) => {
        return (
          <Comment
            key={comment!.id}
            username={comment!.user.username}
            body={comment!.body}
          />
        );
      })}
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // @ts-ignore
  const { pid } = params;

  const client = initializeApollo();

  await client.query({
    query: PostDocument,
    variables: {
      id: pid,
    },
  });

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
  };
};

export default PostPage;
