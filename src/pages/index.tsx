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

        if (name && email && planName && data.user) setUser({ ...data.user, name, email, planName });
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
