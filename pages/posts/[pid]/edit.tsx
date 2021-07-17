import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Form from '../../../components/Form';
import Input from '../../../components/Input';
import { useMeQuery, useUpdatePostMutation } from '../../../generated/graphql';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [editPost] = useUpdatePostMutation({
    onError: (err) => console.log(err),
  });

  const router = useRouter();

  const { pid } = router.query;

  const { data, loading } = useMeQuery();

  if (loading) return <div>loading...</div>;

  if (!data?.me) {
    router.replace(`/posts/${pid}`);
  }

  const editPostHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await editPost({
      variables: { body, title, id: pid as string },
    });

    if (response.data) {
      router.push(`/posts/${pid}`);
    }
  };

  return (
    <Form onSubmit={editPostHandler} title="Edit post" buttonText="Submit">
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

export default EditPost;
