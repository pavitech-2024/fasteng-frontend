// module.exports = {
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/i,
//       issuer: /\.[jt]sx?$/,
//       use: ['@svgr/webpack'],
//     });

//     return config;
//   },
//   compiler: {
//     styledComponents: true,
//   },
//   async rewrites() {
//     return [
//       {
//         source: '/api/forgot-password',
//         destination: 'https://minhaconta.fastengapp.com.br/forgot-password',
//       },
//     ];
//   },
// };
/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config) {
    // Suporte a SVG
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // Ignorar arquivos de teste no build
    config.module.rules.push({
      test: /\.(spec|test)\.(ts|tsx|js|jsx)$/,
      loader: 'ignore-loader',
    });

    return config;
  },

  compiler: {
    styledComponents: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/forgot-password',
        destination: 'https://minhaconta.fastengapp.com.br/forgot-password',
      },
    ];
  },

  // Apenas extensões de páginas reais
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

