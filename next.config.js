/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para ignorar warnings do ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Opcional: também ignorar erros do TypeScript se necessário
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;