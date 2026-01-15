/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, //nao dar erro com o eslint no build
  },
  
  source: '/register',                     // rota limpa que o front chama
  destination: process.env.NEXT_PUBLIC_API_URL, // backend real
};

export default nextConfig;
