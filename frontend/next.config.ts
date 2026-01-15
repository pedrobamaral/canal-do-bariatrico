/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, //nao dar erro com o eslint no build
  },
  
  async rewrites() {
    return [
      {
        source: '/register',                     // rota limpa que o front chama
        destination: process.env.BACK_URL, // backend real
      },
    ];
  },
};

export default nextConfig;
