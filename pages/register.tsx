import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Form from '../components/Form';
import Input from '../components/Input';
import {
  MeDocument,
  MeQuery,
  useMeQuery,
  useRegisterMutation,
} from '../generated/graphql';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const [register, { error }] = useRegisterMutation({ onError: () => {} });

  const { data, loading } = useMeQuery();

  if (loading) return <div>loading...</div>;

  if (data?.me) {
    router.replace('/');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await register({
      variables: { email, username, password },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: 'Query',
            me: { ...data!.register },
          },
        });
      },
    });

    if (response.data) {
      router.push('/');
    }
  };

  return (
    <Form onSubmit={handleSubmit} title="Register" buttonText="Register">
      {error && <span className="text-red-600">{error.message}</span>}
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        id="email-register"
        label="Email"
        required
      />

      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
        id="username"
        label="Username"
        required
      />

      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        id="password-register"
        label="Password"
        required
      />
    </Form>
  );
};

export default Register;
