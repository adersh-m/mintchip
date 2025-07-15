# MintChip – Personal Finance / Expense Tracker – Project Requirements Document

\_Last updated: 2025‑07‑16\_

**Repository (GitHub)**: [https://github.com/adersh-m/mintchip](https://github.com/adersh-m/mintchip)

* * *

## 1 · Purpose

Deliver a responsive, offline‑capable web application that allows individual users to record expenses, visualise spending patterns, and manage monthly category budgets so they can make data‑driven financial decisions.

## 2 · Goals & Success Metrics

| ID  | Metric | Target |
| --- | --- | --- |
| G‑1 | **On‑boarding speed** – % of test users who add their first transaction and see it graphed | ≥ 90 % within 2 min |
| G‑2 | **Performance** – P75 dashboard initial load on 3 G | < 1 s |
| G‑3 | **Offline sync** – queued transaction latency after reconnection | < 5 s |

## 3 · Scope

* **In‑scope** – email/password auth, CRUD for transactions & budgets, pie/line charts, CSV export, PWA install prompt.
  
* **Out‑of‑scope** – bank‑API aggregation, multi‑currency FX conversions, shared/multi‑user accounts.
  

## 4 · User Stories

1. *As a new user I want to register with email/password so my data syncs across devices.*
  
2. *As a returning user I want to filter expenses by month and category so I can spot overspending.*
  
3. *As a budget‑conscious user I want to set monthly limits per category and see progress bars so I know when I’m close to exceeding them.*
  
4. *As a traveller I want the app to work offline and sync when I reconnect so I never lose receipts on trips.*
  

## 5 · Functional Requirements

| ID  | Requirement |
| --- | --- |
| F‑1 | Add, edit, delete a transaction (amount, date, category, wallet, notes). |
| F‑2 | Create and update monthly budgets per category. |
| F‑3 | Dashboard shows: current balance, recent transactions list, budget progress, category breakdown pie, spending‑over‑time line graph. |
| F‑4 | Application operates offline, queues writes locally, and auto‑syncs on reconnection. |
| F‑5 | Export transactions CSV for a selected date range. |

##

## 6 · Non‑Functional Requirements

| ID  | Requirement |
| --- | --- |
| N‑1 | Progressive Web App (PWA) with install prompt and offline cache. |
| N‑2 | WCAG 2.1 AA colour contrast and keyboard navigation. |
| N‑3 | All user data encrypted at rest (Firestore) and in transit (HTTPS). |

## 7 · Tech Stack

* **Frontend** – React 18, Vite + TypeScript, React Router v6, Redux Toolkit (RTK Query), TailwindCSS + shadcn/ui, Recharts
  
* **Backend / BaaS** – Firebase Auth & Firestore (serverless)
  
* **Tooling** – Jest + React Testing Library, Cypress, ESLint + Prettier, Husky + lint‑staged, GitHub Actions CI/CD
  

## 8 · Assumptions & Dependencies

* Single‑user accounts; team sharing is future work.
  
* Free Firebase tier is sufficient; may require index/limit tuning.
  
* Users are comfortable entering transactions manually (no bank import for now).
  

## 9 · Constraints & Risks

* Firestore free‑tier read/write rate limits could block heavy testers.
* Bundle size inflation from chart libraries; must stay < 300 kB gz.
* Offline queue conflicts or duplicate writes if connectivity is flaky.

## 10 · Milestones

| ID  | Description | Target Date |
| --- | --- | --- |
| M1  | Auth & route skeleton | Week 1 |
| M2  | Transactions CRUD & list | Week 2 |
| M3  | Budget module + charts | Week 3 |
| M4  | Offline features, PWA audit, CSV export | Week 4 |

* * *

## Supplementary Specification

## A. Expected Screens

1. **Login / Register** – email, password, error handling.
2. **Dashboard** – balance header, recent transactions, budget progress, quick‑add FAB.
3. **Add / Edit Transaction** – form with validation.
4. **Transactions List** – infinite scroll, filters, search.
5. **Budgets** – per‑category budget editor, progress bars.
6. **Reports** – pie (category), line (time), date‑range selector, CSV export.
7. **Settings** – profile, currency, theme, backup, logout.
8. **Error / 404** – friendly fallback.

## B. Proposed Folder Structure (Vite + RTK)

    
    src/
    
    ├─ app/
    
    │   ├─ store.ts               # configureStore()
    
    │   └─ hooks.ts               # typed hooks
    
    ├─ features/
    
    │   ├─ auth/
    
    │   │   ├─ authSlice.ts
    
    │   │   ├─ authService.ts
    
    │   │   └─ LoginPage.tsx
    
    │   ├─ transactions/
    
    │   │   ├─ transactionsSlice.ts
    
    │   │   ├─ api.ts
    
    │   │   └─ components/
    
    │   ├─ budgets/
    
    │   │   ├─ budgetsSlice.ts
    
    │   │   └─ BudgetPage.tsx
    
    │   └─ reports/
    
    │       └─ ReportsPage.tsx
    
    ├─ routes/
    
    │   ├─ AppRoutes.tsx
    
    │   └─ PrivateRoute.tsx
    
    ├─ hooks/
    
    │   ├─ useDebounce.ts
    
    │   └─ useOfflineQueue.ts
    
    ├─ utils/
    
    │   └─ currency.ts
    
    ├─ assets/
    
    └─ tests/
    
        └─ auth.cy.ts
    

## B. Proposed Folder Structure (Vite + RTK)

    
    Login/Register → Dashboard ↘
    
                           Add Transaction → Transaction Details → Edit Transaction
    
                           ↘ Reports
    
                           ↘ Budgets
    
                           ↘ Settings → Logout → Login/Register
    

*Visual PNG committed separately as* `docs/assets/personal_finance_user_flow.png`.

* * *

## Revision History

| Version | Date | Author | Notes |
| --- | --- | --- | --- |
| 1.0 | 2025‑07‑16 | core team | Milestone 1 delivered: tooling, routing, store, auth service, CI & e2e smoke tests |

* * *

> **End of Document**