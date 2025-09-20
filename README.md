# Poll Application

This is a full-stack poll application built with React, Relay, GraphQL, and a Node.js backend.

## Getting Started

To get started, install the dependencies for both the frontend and the backend.

```bash
npm install
npm install --prefix backend
```

## Development

To run the application in development mode, you need to start both the frontend and the backend servers.

**Start the backend server for development:**

```bash
npm run dev --prefix backend
```

This will start the backend server on [http://localhost:3001](http://localhost:3001) and watch for changes.

**Start the frontend server:**

```bash
npm run dev
```

This will start the frontend development server on [http://localhost:3000](http://localhost:3000).

## Testing

To run the tests for the frontend, run the following command:

```bash
npm test
```

## Building for Production

To build the application for production, you need to build both the frontend and the backend.

**Build the backend:**

```bash
npm run build --prefix backend
```

**Build the frontend:**

```bash
npm run build
```

## Other Commands

### Relay Compiler

To run the Relay compiler, use the following command:

```bash
npm run relay
```

### GraphQL Codegen

To generate GraphQL types, use the following command:

```bash
npm run codegen
```
