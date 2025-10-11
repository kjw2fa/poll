import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from 'relay-runtime';

const fetchQuery: FetchFunction = async (operation, variables) => {
  const isServer = typeof window === 'undefined';
  const url = isServer ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/graphql` : '/api/graphql';

  console.log('[Relay Fetch] URL:', url);
  console.log('[Relay Fetch] Operation:', operation.name);
  console.log('[Relay Fetch] Variables:', JSON.stringify(variables, null, 2));

  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };

  if (!isServer) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    });

    console.log('[Relay Response] Status:', response.status);
    console.log('[Relay Response] Status Text:', response.statusText);

    const responseText = await response.text();
    console.log('[Relay Response] Body:', responseText);

    if (!response.ok) {
        console.error('Relay fetch failed with status:', response.status);
        // Throw an error to be caught by the catch block
        throw new Error(`Server responded with status ${response.status}`);
    }

    try {
        return JSON.parse(responseText);
    } catch (e) {
        console.error('Failed to parse JSON response:', e);
        console.error('Original response text:', responseText);
        // Re-throw the error to let Relay know the request failed
        throw e;
    }

  } catch (error) {
    console.error('[Relay Fetch] Network error:', error);
    throw error;
  }
};

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
  isServer: typeof window === 'undefined',
});

export default environment;
