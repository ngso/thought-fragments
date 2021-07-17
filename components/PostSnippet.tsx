import React from 'react';
import Link from 'next/link';

interface Props {
  id: string;
  title: string;
  author: string;
}

const PostSnippet: React.FC<Props> = ({ id, title, author }) => {
  return (
    <div className="bg-white my-4 p-4 w-11/12 max-w-2xl rounded-md">
      <p className="text-gray-500">{author}</p>
      <h3 className="text-xl font-bold cursor-pointer hover:text-blue-700">
        <Link href={`/posts/${id}`}>{title}</Link>
      </h3>
    </div>
  );
};

export default PostSnippet;
