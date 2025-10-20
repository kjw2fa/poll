import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'shared/schema.graphql',
  generates: {
    'shared/schema-types.ts': {
      plugins: ['typescript'],
    },
    'shared/resolver-types.ts': {
      plugins: ['typescript-resolvers'],
      config: {
        contextType: './next-app/app/api/graphql/route#Context',
      },
    },
  },
};

export default config;