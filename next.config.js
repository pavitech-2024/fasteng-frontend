/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    //TO DO: se usuario estiver logado, redirecionar para /apps
    return [
      {
        source: '/_error',
        destination: '/',
      },
    ];
  },
};

module.exports = nextConfig;
