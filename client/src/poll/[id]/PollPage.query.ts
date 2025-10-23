import { graphql } from 'react-relay';

export const PollPageQuery = graphql`
  query PollPageQuery($id: ID!) {
    poll(id: $id) {
      id
      title
      permissions {
        permission_type
        target_id
      }
      ...Vote_poll
      ...EditPoll_poll
      ...PollResults_results
    }
  }
`;
