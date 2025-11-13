# Vue 3 + Vite + TypeScript Microservice App

A modern Vue 3 application built with Vite, TypeScript, and Ant Design Vue, following a microservice-inspired architecture.

## Features

- ⚡️ Vue 3 with Composition API
- 🚀 Vite for fast development and building
- 📘 TypeScript for type safety
- 🎨 Ant Design Vue for UI components
- 🗂️ Vue Router 4 for routing
- 🗄️ Pinia for state management
- 📐 ESLint + Prettier for code quality
- 🪝 Husky + lint-staged for git hooks
- 📝 Commitlint for conventional commits

## Project Structure

```
src/
├─ components/      # Shared components
├─ layouts/         # Layout files (MainLayout.vue)
├─ views/           # Page components (Dashboard, Menu1, Menu2)
├─ router/          # Vue Router setup
├─ services/        # API modules (for microservice integration)
├─ store/           # State management (Pinia)
├─ styles/          # Global SCSS
└─ main.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install

# After installation, Husky will be automatically initialized via the "prepare" script
# If needed, manually initialize Husky:
npx husky install
```

### Development

```bash
# Start development server
npm run dev

# Or with yarn
yarn dev

# Or with pnpm
pnpm dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Type check
npm run type-check
```

## Git Hooks

This project uses Husky for git hooks:

- **pre-commit**: Runs lint-staged to check and format staged files
- **commit-msg**: Validates commit messages using Commitlint

Make sure to initialize Husky after installation:

```bash
npx husky install
```

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

Example: `feat: add user authentication`

## License

MIT

