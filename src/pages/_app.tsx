import type { AppProps } from 'next/app';
import PageConfig from '@/components/config/pageConfig';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <PageConfig>
      <Component {...pageProps} />
    </PageConfig>
  );
};

export default MyApp;
