import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from 'relay-runtime';

const fetchQuery: FetchFunction = (operation, variables) => {
  const isServer = typeof window === 'undefined';
  const url = isServer ? `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/graphql` : '/api/graphql';

  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };

  if (!isServer) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  });
};

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
  isServer: typeof window === 'undefined',
});

export default environment;
