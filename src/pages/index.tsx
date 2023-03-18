import { AuthContext } from '@/contexts/auth';
import Head from 'next/head';
import Link from 'next/link';
import { Component, ReactNode } from 'react';

export default class Login extends Component {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  login() {
    const { AuthService, setUser } = this.context;
    return AuthService.login('brenda@email.com', '12345678').then((data) => {
      if (data.IsAuthorized) {
        const { name, email, planName } = data;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setUser({ ...data.user, name, email, planName });
      }
    });
  }

  render(): ReactNode {
    return (
      <>
        <Head>
          <title>Login FastEng</title>
        </Head>
        <div>
          <h1>Login</h1>
          <button onClick={() => this.login()}>Login Brenda</button>
          <Link href="/teste">TESTE</Link>;
        </div>
      </>
    );
  }
}
