# Poll Application

This is a full-stack poll application built with Next.js, React, Relay, and GraphQL.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI**: [React](https://react.dev/)
- **GraphQL Client**: [Relay](https://relay.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### 1. Installation

Install the project dependencies from the root directory:

```bash
npm install
```

### 2. Running the Development Server

To run the application in development mode, run the following command from the root directory:

```bash
npm run dev
```

This will start the Next.js development server on [http://localhost:3000](http://localhost:3000).

## Development Workflow

### GraphQL and Type Generation

This project uses **Relay** for client-side GraphQL management and type generation.

The workflow is tightly integrated into the Next.js development server:

1.  **Write a Query**: Add a `graphql` query to any React component within the `next-app` directory.
2.  **Save the File**: Upon saving the file, the Next.js server will automatically invoke the **Relay Compiler** in the background.
3.  **Types are Generated**: The compiler finds your query, validates it against the schema (`shared/schema.graphql`), and generates all necessary TypeScript types in a `__generated__` directory next to your component.

#### Manual Type Generation

If you ever need to run the Relay compiler manually (e.g., for debugging or after a large number of changes), you can use the `relay` script:

```bash
# From the root directory
npm run relay -w next-app
```

This command will manually scan the `next-app` directory and generate all necessary GraphQL types.