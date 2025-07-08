/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/LLM-Calculator',
  assetPrefix: '/LLM-Calculator',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig