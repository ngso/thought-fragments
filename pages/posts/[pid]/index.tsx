import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import ActionLink from '../../../components/ActionLink';
import Comment from '../../../components/Comment';
import NewComment from '../../../components/NewComment';
import {
  PostDocument,
  useDeletePostMutation,
  useMeQuery,
  usePostQuery,
} from '../../../generated/graphql';
import { initializeApollo } from '../../../lib/apollo';

const PostPage = () => {
  const router = useRouter();

  const { pid } = router.query;

  const { data, loading } = usePostQuery({ variables: { id: pid as string } });
  const { data: meData, loading: meLoading } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (loading) return <div>loading...</div>;

  if (!data?.post) {
    return <div>Post does not exist</div>;
  }

  let ownPost = false;
  if (meData?.me?.username === data.post.user.username && !meLoading) {
    ownPost = true;
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

        {ownPost && (
          <div className="mb-4 space-x-2">
            <ActionLink
              color="blue"
              onClick={() => router.push(`/posts/${pid}/edit`)}
            >
              Edit
            </ActionLink>

            <ActionLink
              color="red"
              onClick={async () => {
                await deletePost({ variables: { id: pid as string } });
                router.push('/');
              }}
            >
              Delete
            </ActionLink>
          </div>
        )}

        <div>{data!.post.body}</div>
      </div>

      {meData?.me && !meLoading ? <NewComment postId={data!.post.id} /> : null}

      {data!.post.comments.map((comment) => {
        return (
          <Comment
            id={comment!.id}
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
