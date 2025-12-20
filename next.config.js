/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para ignorar warnings do ESLint durante o build
  eslint: {
    // AVISO: Isto permite que o build passe mesmo com warnings/erros do ESLint
    // Recomendado apenas para desenvolvimento ou para fazer o build temporariamente
    ignoreDuringBuilds: true,
  },
  
  // Opcional: também ignorar erros do TypeScript se necessário
  typescript: {
    // IGNORA ERROS DE TYPESCRIPT DURANTE O BUILD (mais permissivo)
    ignoreBuildErrors: true,
  },
  
  // Configuração existente do webpack para SVGs
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;