# MintChip Development Guide

## Quick Start

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start development server**

   ```bash
   pnpm dev
   ```

3. **Run tests**
   ```bash
   pnpm test
   ```

## Development Scripts

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `pnpm dev`        | Start development server with HMR      |
| `pnpm build`      | Build for production                   |
| `pnpm test`       | Run unit tests with coverage           |
| `pnpm test:watch` | Run tests in watch mode                |
| `pnpm test:ui`    | Open Vitest UI for interactive testing |
| `pnpm lint`       | Run ESLint                             |
| `pnpm lint:fix`   | Fix ESLint errors automatically        |
| `pnpm format`     | Check code formatting                  |
| `pnpm format:fix` | Fix formatting issues                  |
| `pnpm type-check` | Run TypeScript type checking           |
| `pnpm e2e`        | Run end-to-end tests                   |
| `pnpm clean`      | Clean build artifacts                  |

## Environment Setup

### Vite Environment Files

Vite uses a hierarchical environment file system:

1. **`.env`** - Base variables (committed to git)
2. **`.env.development`** - Development mode variables (committed to git)
3. **`.env.production`** - Production mode variables (committed to git)
4. **`.env.local`** - Local overrides (NOT committed to git)

### Setup Steps

1. **For local development overrides** (optional):

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your local settings
   ```

2. **Default configuration works out of the box**:
   - Development: `pnpm dev` uses `.env` + `.env.development`
   - Production: `pnpm build` uses `.env` + `.env.production`

### Environment Variables

```env
# Firebase Configuration (all modes)
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"
VITE_FIREBASE_MEASUREMENT_ID="your_measurement_id"

# Development (pnpm dev)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_MOCK_API=true
VITE_DEBUG_MODE=true

# Production (pnpm build)
VITE_API_BASE_URL=https://api.mintchip.app
VITE_ENABLE_MOCK_API=false
VITE_DEBUG_MODE=false
```

## Path Aliases

Use these aliases for cleaner imports:

```typescript
import { Button } from '@/components/Button';
import { useAuth } from '@/features/auth/hooks';
import { formatCurrency } from '@/lib/utils';
```

Available aliases:

- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/features/*` → `./src/features/*`
- `@/lib/*` → `./src/lib/*`
- `@/app/*` → `./src/app/*`
- `@/pages/*` → `./src/pages/*`
- `@/routes/*` → `./src/routes/*`

## VS Code Setup

### Recommended Extensions

- **Tailwind CSS IntelliSense** - Auto-completion for Tailwind classes
- **ES7+ React/Redux/React-Native snippets** - Useful React snippets
- **Auto Rename Tag** - Automatically rename paired HTML tags
- **TypeScript Importer** - Auto import TypeScript modules
- **Todo Tree** - Highlight TODO comments
- **Path Intellisense** - Autocomplete filenames

### Keyboard Shortcuts

- `Ctrl+Shift+P` → Open command palette
- `Ctrl+Shift+\`` → Open terminal
- `Ctrl+Shift+E` → Toggle file explorer
- `F5` → Start debugging
- `Ctrl+F5` → Run without debugging

## Git Hooks

Pre-commit hooks automatically run:

- **ESLint** - Code linting and auto-fixing
- **Prettier** - Code formatting
- **Type checking** - TypeScript validation

Pre-push hooks run:

- **Full test suite** - Ensures all tests pass
- **Type checking** - Final TypeScript validation

## Testing Strategy

### Unit Tests

- **Location**: `src/**/__tests__/`
- **Files**: `*.spec.ts` or `*.spec.tsx`
- **Framework**: Vitest + React Testing Library

### E2E Tests

- **Location**: `cypress/e2e/`
- **Files**: `*.cy.ts`
- **Framework**: Cypress

### Test Utilities

```typescript
// Mock API responses
import { rest } from 'msw';

// Test component rendering
import { render, screen } from '@testing-library/react';

// User interactions
import userEvent from '@testing-library/user-event';
```

## Architecture Patterns

### Feature-Based Structure

```
src/features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── __tests__/
└── transactions/
    ├── components/
    ├── api.ts
    ├── slice.ts
    └── types.ts
```

### State Management

- **Global State**: Redux Toolkit + RTK Query
- **Local State**: React hooks (useState, useReducer)
- **Form State**: Controlled components

### API Layer

- **Development**: Mock Service Worker (MSW)
- **Production**: Firebase REST API
- **Caching**: RTK Query automatic caching

## Performance Tips

1. **Bundle Analysis**

   ```bash
   pnpm build
   npx vite-bundle-analyzer dist
   ```

2. **Lazy Loading**

   ```typescript
   const LazyComponent = lazy(() => import('./Component'));
   ```

3. **Memoization**
   ```typescript
   const MemoizedComponent = memo(Component);
   const memoizedValue = useMemo(() => expensiveCalculation(), [deps]);
   ```

## Debugging

### Browser DevTools

- **React DevTools** - Component tree and props inspection
- **Redux DevTools** - State management debugging
- **Network Tab** - API request monitoring

### VS Code Debugging

1. Set breakpoints in your code
2. Press `F5` to start debugging
3. Use the debug console for variable inspection

### Common Issues

**Mock Service Worker not starting:**

```bash
# Ensure MSW is properly set up
npm run msw:init
```

**TypeScript errors:**

```bash
# Clear TypeScript cache
rm -rf node_modules/.tmp
pnpm type-check
```

**Test failures:**

```bash
# Clear test cache
pnpm test --clearCache
```

## Deployment

### Build for Production

```bash
pnpm build
```

### Environment Variables

Set these in your deployment platform:

- `VITE_API_BASE_URL` - Production API URL
- `VITE_ENABLE_MOCK_API=false` - Disable mocks in production

### Performance Checklist

- [ ] Bundle size < 300KB gzipped
- [ ] Lighthouse score > 90
- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables configured
