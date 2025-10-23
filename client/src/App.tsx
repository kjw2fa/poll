import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import RelayEnvironment from './RelayEnvironment';
import Home from './page';

function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </RelayEnvironmentProvider>
  );
}

export default App;
