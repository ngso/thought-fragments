import { useState } from 'react';

const NewComment = () => {
  const [comment, setComment] = useState('');

  return (
    <div className="bg-white w-11/12 max-w-3xl mb-4 p-8 rounded-md">
      <textarea
        className="border border-gray-200 rounded-md resize-none w-full h-full outline-none p-4 mb-2"
        value={comment}
        onChange={(e) => setComment(e.currentTarget.value)}
      />
      <button className="w-full py-2 bg-blue-600 text-white rounded-md">
        Add Comment
      </button>
    </div>
  );
};

export default NewComment;
