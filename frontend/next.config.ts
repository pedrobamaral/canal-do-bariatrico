/** @type {import('next').NextConfig} */
const nextConfig = {
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
