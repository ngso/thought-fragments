import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMeQuery } from '../generated/graphql';

interface Props {
  id: string;
  title: string;
  author: string;
}

const PostSnippet: React.FC<Props> = ({ id, title, author }) => {
  const { data, loading } = useMeQuery();

  if (loading) return <div>loading...</div>;

  let ownPost = false;
  if (data?.me?.username === author) {
    ownPost = true;
  }

  const router = useRouter();

  return (
    <div className="flex justify-between bg-white my-4 p-4 w-11/12 max-w-2xl rounded-md">
      <div>
        <p className="text-gray-500">{author}</p>
        <h3 className="text-xl font-bold cursor-pointer hover:text-blue-700">
          <Link href={`/posts/${id}`}>{title}</Link>
        </h3>
      </div>
      <div>
        {ownPost && (
          <span
            className="hover:text-blue-600 cursor-pointer text-sm"
            onClick={() => router.push(`/posts/${id}/edit`)}
          >
            Edit
          </span>
        )}
      </div>
    </div>
  );
};

export default PostSnippet;
