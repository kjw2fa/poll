import { graphql } from 'react-relay';

export const MyPollsPageQuery = graphql`
  query MyPollsPageQuery($userId: ID!, $permission: PermissionType) {
    user(id: $userId) {
      polls(permission: $permission) {
        id
        ...PollCard_poll
      }
    }
  }
`;
