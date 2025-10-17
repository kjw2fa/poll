import { graphql } from 'react-relay';

export const PollSearchQuery = graphql`
  query pageSearchQuery($searchTerm: String!) {
    searchPolls(searchTerm: $searchTerm) {
      ...PollList_polls
    }
  }
`;
