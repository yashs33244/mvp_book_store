/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['books.yashprojects.online', 'localhost:3000'],
    },
  },
  images: {
    domains: [
      'localhost', 
      'studentimagess.s3.us-east-1.amazonaws.com', 
      'studentimagess.s3.amazonaws.com',
      'apibooks.yashprojects.online',
      'books.yashprojects.online'
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://apibooks.yashprojects.online',
    NODE_ENV: process.env.NODE_ENV || 'production',
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
}

module.exports = nextConfig 