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
};

export default nextConfig;
