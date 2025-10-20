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

## Project Structure

This project is a monorepo managed with npm workspaces. The structure is designed to keep the frontend (`next-app`) and shared code (`shared`) separate but managed within a single repository.

### Root `package.json`

The `package.json` file at the root of the project serves several key purposes:

-   **Defines Workspaces**: It declares the workspaces (e.g., `next-app`, `shared`), allowing `npm` to manage them as a single project.
-   **Shared Development Dependencies**: It holds `devDependencies` that are common across all workspaces, such as `typescript`. This ensures consistency and avoids duplication.
-   **Root Scripts**: It contains top-level scripts for running, building, and testing the application. These scripts typically delegate to the workspace-specific scripts. For example, `npm run build` in the root runs `npm run build` inside the `next-app` workspace.

### Workspace `package.json`

Each workspace (e.g., `next-app/package.json`) has its own `package.json` file to manage its specific dependencies and scripts.

-   **`next-app`**: This is the main Next.js application. Its `package.json` includes dependencies like `react`, `next`, and `relay-compiler`.
-   **`shared`**: This workspace is intended for code that can be shared between different parts of the application (e.g., types, validation logic).

This structure helps in organizing the codebase, managing dependencies efficiently, and scaling the project in the future.

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