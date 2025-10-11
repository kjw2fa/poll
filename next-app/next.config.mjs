/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['shared'],
  compiler: {
    relay: {
      src: './',
      language: 'typescript',
      schema: '../shared/schema.graphql',
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
};

export default nextConfig;
