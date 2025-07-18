# Single Source of Truth in MintChip Application

## Data Flow Architecture Overview

Your MintChip application **DOES have a single source of truth** - it's implemented through Redux Toolkit with RTK Query. Here's how it works:

```
┌─────────────────────────────────────────────────────────────────┐
│                    🎯 SINGLE SOURCE OF TRUTH                    │
│                        Redux Store                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  STATE SLICES:                                          │    │
│  │  • auth: { status, user }                               │    │
│  │  • transactions: EntityAdapter<Transaction>             │    │
│  │  • budgets: EntityAdapter<Budget>                       │    │
│  │  • transactionApi: RTK Query Cache                      │    │
│  │  • budgetApi: RTK Query Cache                           │    │
│  │  • reportsApi: RTK Query Cache                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                      📊 DATA PROVIDERS                        │
│                                                                │
│  🔄 RTK Query APIs:           🎭 Mock Service Worker:         │
│  • transactionApi.ts         • /api/transactions               │
│  • budgetApi.ts              • /api/budgets                    │
│  • reportsApi.ts             • /api/reports/category           │
│                               • /api/reports/timeline          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     🧩 REACT COMPONENTS                        │ │                                                                 │
│  • TransactionList ←→ useGetTransactionsQuery                   │
│  • BudgetList ←→ useGetBudgetsQuery                             │
│  • ReportsPage ←→ useGetCategoryReportQuery                     │
│  • PieChart ←→ useGetTimelineReportQuery                        │
└─────────────────────────────────────────────────────────────────┘
```

## Key Points About Your Single Source of Truth:

### ✅ **What IS the Single Source of Truth**

1. **Redux Store**: The central state container that holds ALL application state
2. **RTK Query Cache**: Automatically managed cache for server data
3. **Entity Adapters**: Normalized state for transactions and budgets

### ✅ **How Data Flows (Single Direction)**

```
API Request → RTK Query → Redux Cache → React Components
     ↑                                        │
     └────────── User Actions ←──────────────┘
```

### ✅ **Cache Management (Automatic)**

- **Shared Cache**: Multiple components using `useGetTransactionsQuery('2025-07')` share the same cached data
- **Automatic Updates**: When you create a transaction, RTK Query invalidates the cache and refetches
- **Deduplication**: RTK Query prevents multiple identical requests

## Data Flow Example

Let's trace a transaction creation:

```typescript
// 1. User submits form in TransactionForm
const [createTransaction] = useCreateTransactionMutation();
await createTransaction(newTransaction);

// 2. RTK Query makes POST request to /api/transactions
// 3. MSW handles the request, adds transaction, and calculates budget spending
// 4. RTK Query invalidates cache with tags 'Transaction' AND 'Budgets'
// 5. All components using useGetTransactionsQuery automatically refetch
// 6. BudgetList ALSO refetches and shows updated spending amounts
// 7. Reports automatically update because they derive from transaction data
```

## Current Implementation Details

### 📁 **Store Configuration** (`src/app/store.ts`)
```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,                    // ← Auth state
    transactions: transactionReducer,     // ← Transaction entities
    budgets: budgetReducer,              // ← Budget entities  
    [transactionApi.reducerPath]: transactionApi.reducer,  // ← API cache
    [budgetApi.reducerPath]: budgetApi.reducer,            // ← API cache
    [reportsApi.reducerPath]: reportsApi.reducer,          // ← API cache
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      transactionApi.middleware,    // ← Auto cache management
      budgetApi.middleware,         // ← Auto cache management  
      reportsApi.middleware         // ← Auto cache management
    ),
});
```

### 🔄 **API Layers**

#### Transaction API (`src/features/transactions/api.ts`)
```typescript
export const transactionApi = createApi({
  reducerPath: 'transactionApi',           // ← Unique cache key
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Transaction'],               // ← Cache invalidation tags
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], string>({
      query: (monthIso) => `transactions?month=${monthIso}`,
      providesTags: ['Transaction'],       // ← Provides cached data
    }),
    createTransaction: builder.mutation<Transaction, Partial<Transaction>>({
      invalidatesTags: ['Transaction'],    // ← Invalidates cache
    }),
  }),
});
```

#### Reports API (`src/features/reports/api.ts`)
```typescript
export const reportsApi = createApi({
  reducerPath: 'reportsApi',
  tagTypes: ['CategoryReport', 'TimelineReport'],
  endpoints: (builder) => ({
    getCategoryReport: builder.query<CategoryReport, ReportParams>({
      // Reports are derived from transaction data
      // When transactions change, reports automatically update
    }),
  }),
});
```

### 🎭 **Mock Service Worker** (`src/mocks/handlers.ts`)

**Important**: MSW is NOT a separate data source - it's just a **development tool** that intercepts HTTP requests and returns fake responses. In production, you'd replace this with a real API.

```typescript
// MSW intercepts /api/* requests and returns mock data
export const handlers = [
  rest.get('/api/transactions', (req, res, ctx) => {
    // Returns mock transaction data
    return res(ctx.json(mockTransactions));
  }),
  rest.get('/api/reports/category', (req, res, ctx) => {
    // Calculates reports from mock transaction data  
    return res(ctx.json(categoryReport));
  }),
];
```

## Why This IS a Single Source of Truth

### ✅ **Data Consistency**
- All components reading transactions get the same data from Redux cache
- Reports are always based on the same transaction data
- No component maintains its own copy of server data

### ✅ **Automatic Synchronization** 
- Create a transaction → All transaction lists update automatically
- No manual cache management needed
- RTK Query handles all the complexity

### ✅ **Predictable State Updates**
- All mutations go through RTK Query
- Cache invalidation is automatic and consistent
- State changes are traceable through Redux DevTools

## Common Confusion Points

### ❓ **"Are there multiple data sources?"**
**No** - There's one Redux store. The APIs (transactionApi, budgetApi, reportsApi) are just different **endpoints** that feed into the same store.

### ❓ **"Is MSW a separate data source?"**
**No** - MSW is just a **mock server** for development. Your React components don't know or care whether data comes from MSW or a real API.

### ❓ **"Do reports have separate data?"**
**No** - Reports are **computed from transaction data**. The MSW handlers prove this - they calculate reports from the same mock transactions.

### ❓ **"Why don't budgets update when I add transactions?"** (FIXED!)
**Previously**: This was a bug! Budget cache wasn't invalidated when transactions changed.
**Now Fixed**: Transaction mutations now invalidate both `Transaction` and `Budgets` cache tags, and MSW calculates spending dynamically from transactions.

## Real API Migration

When you replace MSW with a real API, the single source of truth remains the same:

```typescript
// Before (MSW)
baseQuery: fetchBaseQuery({ baseUrl: '/api' })  // → MSW intercepts

// After (Real API) 
baseQuery: fetchBaseQuery({ baseUrl: 'https://api.mintchip.com' })  // → Real server
```

Your components and Redux store don't change at all!

## Summary

✅ **You DO have a single source of truth**: Redux Store with RTK Query cache  
✅ **Data flows in one direction**: API → Redux → Components  
✅ **Automatic synchronization**: RTK Query handles cache invalidation  
✅ **Type safety**: Full TypeScript integration throughout  
✅ **Future-proof**: Easy migration from mock to real API  

The architecture is solid and follows Redux Toolkit best practices for modern React applications.
