/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'zythorix360.com', 'www.zythorix360.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig