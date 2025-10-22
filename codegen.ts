import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'shared/schema.graphql',
  generates: {
    'shared/schema.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: './types/context.js#ResolverContext',
        useIndexSignature: true,
      },
    },
  },
};

export default config;