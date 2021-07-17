import { useState } from 'react';
import produce from 'immer';
import {
  PostDocument,
  PostQuery,
  useNewCommentMutation,
} from '../generated/graphql';

interface Props {
  postId: string;
}

const NewComment: React.FC<Props> = ({ postId }) => {
  const [comment, setComment] = useState('');

  const [newComment] = useNewCommentMutation({ onError: () => {} });

  const newCommentHandler = async () => {
    await newComment({
      variables: { body: comment, postId },
      update: (cache, { data }) => {
        const currentPost = cache.readQuery<PostQuery>({
          query: PostDocument,
          variables: { id: postId },
        });

        cache.writeQuery({
          query: PostDocument,
          variables: { id: postId },
          data: produce(currentPost, (p) => {
            p!.post!.comments!.push(data!.newComment);
          }),
        });
      },
    });

    setComment('');
  };

  return (
    <div className="flex flex-col bg-white w-11/12 max-w-3xl mb-4 p-8 rounded-md">
      <textarea
        className="border border-gray-200 rounded-md resize-none w-full outline-none p-4 mb-2"
        value={comment}
        onChange={(e) => setComment(e.currentTarget.value)}
      />
      <button
        onClick={newCommentHandler}
        className="w-full py-2 bg-blue-600 text-white rounded-md"
      >
        Add Comment
      </button>
    </div>
  );
};

export default NewComment;
