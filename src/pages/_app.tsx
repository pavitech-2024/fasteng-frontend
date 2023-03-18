import type { AppProps } from 'next/app';
import PageConfig from '@/components/config/pageConfig';
import { AuthProvider } from '@/contexts/auth';
import Api from '@/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const token: string | undefined = Cookies.get('token');
  const _id: string | undefined = Cookies.get('_id');
  const isAuthenticated: boolean = Cookies.get('isAuthenticated') === 'true';
  const router = useRouter();

  // Refresh login logic
  /**@description caso não esteja autenticado mas tiver token e _id nos cookies, tentar realizar refresh login */
  if ((router.pathname === '/' || !isAuthenticated) && token && _id)
    Api.post('auth/refresh-login', { token: JSON.parse(token), _id: JSON.parse(_id) }).then((response) =>
      console.log(response)
    );

  return (
    <PageConfig>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </PageConfig>
  );
};

export default MyApp;
