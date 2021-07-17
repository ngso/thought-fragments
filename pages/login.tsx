import { useState } from 'react';
import { useRouter } from 'next/router';
import Form from '../components/Form';
import Input from '../components/Input';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const [login, { error }] = useLoginMutation({ onError: () => {} });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await login({
      variables: { email, password },
      update: (cache, { data }) => {
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: 'Query',
            me: { ...data!.login },
          },
        });
      },
    });

    if (response.data) {
      router.push('/');
    }
  };

  return (
    <Form onSubmit={handleSubmit} title="Login" buttonText="Login">
      {error && <span className="text-red-600">{error.message}</span>}
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        id="email-login"
        label="Email"
        required
      />

      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        id="password-login"
        label="Password"
        required
      />
    </Form>
  );
};

export default Login;
