import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '/Users/kevwumba/Documents/Projects/poll/server/schema.graphql',
  generates: {
    './schema.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: './types/context#ResolverContext',
        useIndexSignature: true,
      },
    },
  },
};

export default config;