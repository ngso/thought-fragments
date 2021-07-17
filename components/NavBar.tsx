import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from '../generated/graphql';
import NavItem from './NavItem';

const NavBar = () => {
  const { data, loading } = useMeQuery();
  const [logout] = useLogoutMutation();

  const router = useRouter();

  let nav: ReactElement = <div>loading...</div>;
  if (!loading) {
    nav = (
      <>
        {data?.me ? (
          <>
            <NavItem onClick={() => {}}>Create new post</NavItem>
            <NavItem
              onClick={() => {
                logout({
                  update: (cache) => {
                    cache.writeQuery<MeQuery>({
                      query: MeDocument,
                      data: {
                        __typename: 'Query',
                        me: null,
                      },
                    });
                  },
                });
              }}
            >
              Logout
            </NavItem>
          </>
        ) : (
          <>
            <NavItem onClick={() => router.push('/login')}>Log in</NavItem>
            <NavItem onClick={() => router.push('/register')}>
              Create account
            </NavItem>
          </>
        )}
      </>
    );
  }

  return (
    <nav className="flex justify-end bg-white p-4">
      <NavItem onClick={() => router.push('/')}>Home</NavItem>
      {nav}
    </nav>
  );
};

export default NavBar;
