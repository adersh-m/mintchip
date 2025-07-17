import { setupWorker, rest } from 'msw';
import type { Transaction } from '../features/transactions/types';
import type { Budget } from '../features/budgets/types';

// Mock data
const mockTransactions: Transaction[] = [
    {
        id: '1',
        amount: 250,
        category: 'Food',
        date: '2025-07-15',
        note: 'Grocery shopping',
        wallet: 'card'
    },
    {
        id: '2',
        amount: 50,
        category: 'Transport',
        date: '2025-07-14',
        note: 'Bus fare',
        wallet: 'cash'
    },
    {
        id: '3',
        amount: 1200,
        category: 'Entertainment',
        date: '2025-07-13',
        note: 'Movie tickets',
        wallet: 'card'
    }
];

const mockBudgets: Budget[] = [
    {
        id: '1',
        category: 'Food',
        amount: 5000,
        month: '2025-07',
        spent: 2250
    },
    {
        id: '2',
        category: 'Transport',
        amount: 2000,
        month: '2025-07',
        spent: 800
    },
    {
        id: '3',
        category: 'Entertainment',
        amount: 3000,
        month: '2025-07',
        spent: 1200
    }
];

export const handlers = [
    // Transaction endpoints
    rest.get('/api/transactions', (req, res, ctx) => {
        console.log('MSW: GET /api/transactions');
        const month = req.url.searchParams.get('month') || '2025-07';
        console.log('MSW: Filtering by month:', month);
        
        const filteredTransactions = mockTransactions.filter(t => 
            t.date.startsWith(month)
        );
        
        console.log('MSW: Returning transactions:', filteredTransactions);
        return res(
            ctx.delay(200),
            ctx.json(filteredTransactions)
        );
    }),

    rest.post('/api/transactions', async (req, res, ctx) => {
        console.log('MSW: POST /api/transactions');
        try {
            const transaction = await req.json() as Omit<Transaction, 'id'>;
            console.log('MSW: Creating transaction:', transaction);
            
            const newTransaction: Transaction = {
                ...transaction,
                id: Date.now().toString()
            };
            
            mockTransactions.push(newTransaction);
            console.log('MSW: Created transaction:', newTransaction);
            
            return res(
                ctx.delay(200),
                ctx.json(newTransaction)
            );
        } catch (error) {
            console.error('MSW: Error creating transaction:', error);
            return res(
                ctx.status(500),
                ctx.json({ error: 'Failed to create transaction' })
            );
        }
    }),

    // Budget endpoints
    rest.get('/api/budgets', (req, res, ctx) => {
        console.log('MSW: GET /api/budgets');
        const month = req.url.searchParams.get('month') || '2025-07';
        console.log('MSW: Filtering budgets by month:', month);
        
        const filteredBudgets = mockBudgets.filter(b => 
            b.month === month
        );
        
        console.log('MSW: Returning budgets:', filteredBudgets);
        return res(
            ctx.delay(200),
            ctx.json(filteredBudgets)
        );
    }),

    rest.post('/api/budgets', async (req, res, ctx) => {
        console.log('MSW: POST /api/budgets');
        try {
            const budget = await req.json() as Omit<Budget, 'id'>;
            console.log('MSW: Creating budget:', budget);
            
            const newBudget: Budget = {
                ...budget,
                id: Date.now().toString(),
                spent: 0
            };
            
            mockBudgets.push(newBudget);
            console.log('MSW: Created budget:', newBudget);
            
            return res(
                ctx.delay(200),
                ctx.json(newBudget)
            );
        } catch (error) {
            console.error('MSW: Error creating budget:', error);
            return res(
                ctx.status(500),
                ctx.json({ error: 'Failed to create budget' })
            );
        }
    })
];

export const worker = setupWorker(...handlers);
