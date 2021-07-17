import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Form from '../../components/Form';
import Input from '../../components/Input';
import { useNewPostMutation } from '../../generated/graphql';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [addNewPost] = useNewPostMutation({
    onError: (err) => console.log(err),
  });

  const router = useRouter();

  const newPostHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await addNewPost({ variables: { body, title } });

    if (response.data) {
      router.push('/');
    }
  };

  return (
    <Form onSubmit={newPostHandler} title="Add new post" buttonText="Submit">
      <Input
        value={title}
        type="text"
        id="title"
        onChange={(e) => setTitle(e.currentTarget.value)}
        placeholder="New title here"
      />

      <textarea
        className="border border-gray-300 rounded-md resize-none w-full -mt-3 outline-none p-2 mb-2 focus:border-blue-600"
        value={body}
        onChange={(e) => setBody(e.currentTarget.value)}
        placeholder="New body here"
      />
    </Form>
  );
};

export default NewPost;
