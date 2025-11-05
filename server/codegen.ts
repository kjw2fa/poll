import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '/Users/kevwumba/Documents/Projects/poll/shared/schema.graphql',
  generates: {
    '../shared/schema.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../server/types/context.js#ResolverContext',
        useIndexSignature: true,
        mappers: {
          Poll: '@prisma/client#Poll as PollModel',
          User: '@prisma/client#User as UserModel',
          PollOption: '@prisma/client#PollOption as PollOptionModel',
          PollPermissions: '@prisma/client#PollPermission as PollPermissionModel',
          Vote: '@prisma/client#PollVote as PollVoteModel',
        }
      },
    },
  },
};

export default config;