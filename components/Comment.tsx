import { useRouter } from 'next/router';
import {
  PostDocument,
  useDeleteCommentMutation,
  useMeQuery,
} from '../generated/graphql';

interface Props {
  id: string;
  username: string;
  body: string;
}

const Comment: React.FC<Props> = ({ id, username, body }) => {
  const { data, loading } = useMeQuery();

  const router = useRouter();
  const { pid } = router.query;

  const [deleteComment] = useDeleteCommentMutation();

  if (loading) return <div>loading...</div>;

  let ownComment = false;
  if (data?.me?.username === username) {
    ownComment = true;
  }

  const handleDeleteComment = async () => {
    await deleteComment({
      variables: { id },
      update(cache) {
        // @ts-ignore
        const { post } = cache.readQuery({
          query: PostDocument,
          variables: { id: pid as string },
        });

        cache.modify({
          id: cache.identify(post as any),
          fields: {
            comments(existing, { readField }) {
              return existing.filter((c: any) => readField('id', c) !== id);
            },
          },
        });
      },
    });
  };

  return (
    <article className="flex justify-between bg-white w-11/12 max-w-3xl mb-4 p-8 rounded-md">
      <div>
        <h3 className="font-bold">{username}</h3>
        <p>{body}</p>
      </div>
      {ownComment && (
        <span
          onClick={handleDeleteComment}
          className="hover:text-red-600 cursor-pointer text-sm"
        >
          Delete
        </span>
      )}
    </article>
  );
};

export default Comment;
