# MintChip - React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

[![CI (build‑test‑lint)](https://github.com/adersh-m/mintchip/actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)
[![E2E (cypress-run)](https://github.com/adersh-m/mintchip/actions/workflows/e2e.yml/badge.svg)](../../actions/workflows/e2e.yml)

> **Milestone 1 complete** — core tooling, routing, Redux store, auth service, CI matrix, and Cypress smoke test are live on `main`.

## Product Requirements Document (PRD)

📋 **PRD Canvas**: [View PRD Canvas](https://github.com/adersh-m/mintchip/blob/main/docs/PRD_Personal_Finance_Expense_Tracker.md)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Firebase account for authentication and data storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adersh-m/mintchip.git
   cd mintchip
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config to `src/lib/firebase.ts`

4. **Start the development server**
   ```bash
   pnpm dev
   ```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run unit tests with coverage
- `pnpm lint` - Run ESLint
- `pnpm format` - Check code formatting with Prettier
- `pnpm preview` - Preview production build locally

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Cypress
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier

## Project Structure

```
src/
├── app/                    # Redux store configuration
├── components/            # Reusable UI components
├── features/              # Feature-based modules
│   └── auth/             # Authentication logic
├── lib/                  # External service configurations
├── pages/                # Page components
│   ├── Dashboard/        # Main dashboard
│   ├── Login/           # Authentication pages
│   └── Settings/        # User settings
├── routes/              # Routing configuration
└── styles/              # Global styles
```

## Key Features

- 🔐 **Authentication**: Secure email/password auth with Firebase
- 💰 **Expense Tracking**: Add, edit, and categorize transactions
- 📊 **Budget Management**: Set monthly budgets and track progress
- 📈 **Data Visualization**: Charts and graphs for spending insights
- 🔄 **Offline Support**: PWA capabilities for offline usage
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
