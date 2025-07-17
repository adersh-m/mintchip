# MintChip - Personal Finance Management

## UI Testing Guide

This application now has a complete UI for testing both the Transaction and Budget management features.

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

### Features Available for Testing

#### 🏠 Dashboard (`/`)
- Overview of the application
- Quick navigation to Transactions and Budgets
- Basic statistics display

#### 💰 Transactions (`/transactions`)
- **Add New Transaction Form:**
  - Amount input with validation
  - Date picker
  - Category input
  - Wallet selection (Cash/Card)
  - Optional notes
- **Transaction History:**
  - Month filter dropdown
  - Category filter dropdown
  - List of transactions with details
  - Responsive design

#### 📊 Budgets (`/budgets`)
- **Create Budget Form:**
  - Category input
  - Budget amount input
  - Month selector (controlled by URL params)
- **Budget Overview:**
  - List of budgets for selected month
  - Spent amount tracking
  - Remaining budget calculations
  - Over-budget warnings

#### ⚙️ Settings (`/settings`)
- Basic settings page (placeholder)

### Mock Data

The application includes mock data for testing:

**Sample Transactions:**
- Food: ₹250 (2025-07-15)
- Transport: ₹50 (2025-07-14)
- Entertainment: ₹1,200 (2025-07-13)

**Sample Budgets:**
- Food: ₹5,000 (spent: ₹2,250)
- Transport: ₹2,000 (spent: ₹800)
- Entertainment: ₹3,000 (spent: ₹1,200)

### Testing Scenarios

1. **Adding a Transaction:**
   - Go to `/transactions`
   - Fill out the form with valid data
   - Click "Add Transaction"
   - See the transaction appear in the list

2. **Creating a Budget:**
   - Go to `/budgets`
   - Select a month
   - Fill out the budget form
   - Click "Add Budget"
   - See the budget appear in the overview

3. **Filtering Transactions:**
   - Use the month picker to filter by month
   - Use the category filter to filter by category
   - See the list update accordingly

4. **Navigation:**
   - Use the top navigation bar to switch between pages
   - Notice the active page highlighting

### Technical Implementation

- **State Management:** Redux Toolkit with RTK Query
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **Mock API:** MSW (Mock Service Worker)
- **Form Validation:** Client-side validation with user feedback
- **Error Handling:** Comprehensive error states and messages

### Authentication Note

For testing purposes, authentication is temporarily disabled. All routes are accessible without login. In production, authentication would be re-enabled by modifying the `PrivateRoute` component.

### Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

### Browser Testing

The application has been tested to work with:
- Chrome
- Firefox
- Safari
- Edge

### Mobile Responsiveness

The UI is responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)
