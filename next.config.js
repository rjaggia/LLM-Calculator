/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    // Exclude AWS SDK from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
      
      config.externals = config.externals || [];
      config.externals.push({
        '@aws-sdk/client-bedrock-runtime': 'commonjs @aws-sdk/client-bedrock-runtime',
        '@aws-sdk/client-sagemaker': 'commonjs @aws-sdk/client-sagemaker',
      });
    }
    
    return config;
  },
};

module.exports = nextConfig;