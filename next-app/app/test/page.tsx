'use client';

import { graphql } from 'react-relay';

const TestQuery = graphql`
  query TestQuery {
    polls {
      id
    }
  }
`;
