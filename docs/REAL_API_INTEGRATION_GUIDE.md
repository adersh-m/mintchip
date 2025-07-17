# Real API Integration Guide

## Overview

This guide provides step-by-step instructions for migrating from Mock Service Worker (MSW) to a real backend API. The current application uses MSW to simulate API responses during development and testing.

## Why MSW Was Used

MSW (Mock Service Worker) was implemented to:
- **Enable full-stack development** without a real backend
- **Provide realistic testing environment** with proper API simulation
- **Allow complete UI testing** with realistic data flow and loading states
- **Support team development** where frontend can work independently

## Migration Steps

### 1. Remove MSW Setup

**File to modify**: `src/main.tsx`

**Remove this entire block:**

```tsx
// Initialize mock service worker in development
if (import.meta.env.DEV) {
  import('./mocks/handlers').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    }).then(() => {
      console.log('🚀 MSW started successfully');
    }).catch((error) => {
      console.error('❌ MSW failed to start:', error);
    });
  });
}
```

### 2. Update API Base URLs

**Files to modify**: 
- `src/features/budgets/api.ts`
- `src/features/transactions/api.ts`

**Current configuration:**
```typescript
baseQuery: fetchBaseQuery({ baseUrl: '/api' })
```

**Update to:**
```typescript
baseQuery: fetchBaseQuery({ 
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://your-backend-domain.com/api'
})
```

### 3. Add Authentication Headers

Most real APIs require authentication. Update your `fetchBaseQuery` configuration:

```typescript
import type { RootState } from '../../app/store';

export const budgetApi = createApi({
  reducerPath: 'budgetApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add auth token from Redux state or localStorage
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  // ... rest of configuration
});
```

### 4. Environment Variables

Create environment variable files for different environments:

**.env.development:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**.env.production:**
```env
VITE_API_BASE_URL=https://your-production-api.com/api
```

**.env.local** (for local development overrides):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 5. Handle Real API Response Structure

**Current expected structure:**
```typescript
// Budget API expects direct array response
Budget[]

// Transaction API expects direct array response  
Transaction[]
```

**If your real API wraps responses**, update with `transformResponse`:

```typescript
getBudgets: builder.query<Budget[], string>({
  query: (month) => `/budgets?month=${month}`,
  transformResponse: (response: { data: Budget[], success: boolean }) => response.data,
  providesTags: ['Budgets'],
}),
```

### 6. Update Error Handling

**Current error handling works for MSW format. For real APIs, you may need:**

```typescript
// Example for components like TransactionForm.tsx and BudgetForm.tsx
let errorMessage: string = '';
if (isError) {
  if ('status' in error) {
    if (error.status === 'FETCH_ERROR' || error.status === 'PARSING_ERROR') {
      errorMessage = error.error;
    } else {
      // Handle your real API error format
      errorMessage = error.data?.message || 
                    error.data?.error || 
                    `Server error (${error.status})`;
    }
  } else {
    errorMessage = error.message || 'An unexpected error occurred';
  }
}
```

### 7. Add Proxy Configuration

**File to modify**: `vite.config.ts`

**Add proxy configuration for development:**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
    },
  },
})
```

### 8. API Endpoint Mapping

**Current MSW endpoints that need real API equivalents:**

#### Budget Endpoints:
- `GET /api/budgets?month=YYYY-MM` → Returns `Budget[]`
- `POST /api/budgets` → Creates new budget, returns `Budget`

#### Transaction Endpoints:
- `GET /api/transactions?month=YYYY-MM` → Returns `Transaction[]`
- `POST /api/transactions` → Creates new transaction, returns `Transaction`

### 9. Clean Up Mock Files

**Delete these files/folders:**
- `src/mocks/` (entire folder)
- `public/mockServiceWorker.js`

**Remove MSW from package.json:**
```bash
npm uninstall msw
```

### 10. Update Tests

**Option 1: Mock RTK Query hooks directly**
```typescript
// In your test files
jest.mock('../api', () => ({
  useGetBudgetsQuery: jest.fn(),
  useCreateBudgetMutation: jest.fn(() => [
    jest.fn(),
    { isLoading: false, isError: false }
  ]),
}));
```

**Option 2: Use RTK Query testing utilities**
```typescript
import { setupApiStore } from '@reduxjs/toolkit/query/react'
import { budgetApi } from '../api'

const storeRef = setupApiStore(budgetApi)
// Use in tests
```

## API Requirements

### Budget API Contract

**Budget Type:**
```typescript
interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string; // Format: YYYY-MM
  spent?: number; // Current spending in this category for the month
}
```

**Required Endpoints:**
- `GET /api/budgets?month=YYYY-MM`
- `POST /api/budgets`

### Transaction API Contract

**Transaction Type:**
```typescript
interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO date string
  note?: string;
  wallet: 'cash' | 'card';
}
```

**Required Endpoints:**
- `GET /api/transactions?month=YYYY-MM`
- `POST /api/transactions`

## Testing the Migration

### 1. Verify API Endpoints
Test each endpoint manually with tools like:
- Postman
- curl
- Your browser's Developer Tools

### 2. Check Component Functionality
- **Transaction Form**: Can create new transactions
- **Budget Form**: Can create new budgets
- **Transaction List**: Displays transactions for selected month
- **Budget List**: Shows budgets with spending progress

### 3. Test Error Scenarios
- Network failures
- Invalid data submissions
- Authentication errors
- Server errors (500, 400, etc.)

## Migration Checklist

- [ ] Remove MSW initialization from `main.tsx`
- [ ] Update `baseUrl` in both API files
- [ ] Add authentication headers if needed
- [ ] Create environment variables (`.env.development`, `.env.production`)
- [ ] Update error handling for real API format
- [ ] Add proxy configuration to `vite.config.ts`
- [ ] Test all CRUD operations with real API
- [ ] Remove `src/mocks/` folder
- [ ] Remove `public/mockServiceWorker.js`
- [ ] Update package.json dependencies
- [ ] Fix any failing tests
- [ ] Update documentation

## Benefits of This Architecture

**Component Independence**: Your React components won't need any changes! The forms, lists, and UI logic remain exactly the same.

**Redux State Management**: All Redux slices and store configuration stay unchanged.

**Type Safety**: TypeScript interfaces ensure consistency between mock and real data.

**Testing**: Comprehensive test coverage continues to work with minimal updates.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Configure your backend to allow requests from your frontend domain
2. **Authentication**: Ensure auth tokens are properly included in requests
3. **Response Format**: Verify real API responses match expected TypeScript interfaces
4. **Error Handling**: Update error message parsing for your specific API error format

### Debug Steps

1. Check browser Developer Tools → Network tab
2. Verify API endpoint URLs are correct
3. Check request/response headers
4. Validate request body format
5. Test with simplified curl commands

## Additional Considerations

### Performance Optimization
- Add caching strategies for frequently accessed data
- Implement pagination for large datasets
- Add loading states and skeleton screens

### Security
- Validate all inputs on both client and server
- Implement proper authentication and authorization
- Use HTTPS in production
- Add rate limiting and request validation

### Monitoring
- Add error logging and monitoring
- Track API performance metrics
- Monitor authentication failures

This migration guide ensures a smooth transition from MSW to a real backend while maintaining all existing functionality and user experience.
