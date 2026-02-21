> [!IMPORTANT]
> This is an experimental repository. There are currently no plans to release a new version of CloudDia.

# Railway Diagram Editor

Railway Diagram Editor is a web-based application built with Vite 7, React 19, and TypeScript. It allows users to create and edit railway diagrams easily and efficiently.

## Features

- Intuitive user interface for creating and editing railway diagrams
- Built with modern web technologies: Vite, React, and TypeScript
- Supports custom assets for enhanced diagram customization

## Project Structure

```
/
├── public/          # Static assets
├── src/             # Source code
│   ├── App.css      # Global styles
│   ├── App.tsx      # Main application component
│   ├── index.css    # Index styles
│   ├── main.tsx     # Application entry point
│   └── assets/      # Additional assets
├── CLAUDE.md        # Project guidance for Claude Code
├── index.html       # Main HTML file
├── oxlint.json      # Linter configuration
├── package.json     # Project dependencies and scripts
├── pnpm-lock.yaml   # Lockfile for pnpm
├── tsconfig.app.json # TypeScript configuration for the app
├── tsconfig.json    # Base TypeScript configuration
├── tsconfig.node.json # TypeScript configuration for Node.js
└── vite.config.ts   # Vite configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd clouddia26
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Build

To create a production build:

```bash
pnpm build
```

The build output will be located in the `dist/` directory.

### Linting

Run the linter:

```bash
pnpm lint
```

### Formatting

Format the codebase:

```bash
pnpm format
```

### Preview

Preview the production build locally:

```bash
pnpm preview
```

## License

This project is licensed under the MIT License.
