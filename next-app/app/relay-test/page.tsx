'use client';

import React, { Suspense } from 'react';
import { graphql } from 'babel-plugin-relay/macro';
import { relay_test_page_Query as RelayTestQueryType } from './__generated__/relay_test_page_Query.graphql';

const RelayTestQuery = graphql`
  query relay_test_page_Query {
    polls {
      id
      title
    }
  }
`;

const RelayTestComponent = () => {
  const data = useLazyLoadQuery<RelayTestQueryType>(RelayTestQuery, {});

  return (
    <div>
      <h1>Relay Test Page</h1>
      <ul>
        {data.polls.map(poll => (
          <li key={poll.id}>{poll.title}</li>
        ))}
      </ul>
    </div>
  );
};

const RelayTestPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RelayTestComponent />
    </Suspense>
  );
};

export default RelayTestPage;
