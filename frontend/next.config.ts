/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/register',                     // rota limpa que o front chama
        destination: 'http://localhost:3000/auth/register', // backend real
      },
    ];
  },
};

export default nextConfig;
