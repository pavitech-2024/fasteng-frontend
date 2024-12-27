module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
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
  future: {
    webpack5: true,
  },
};
