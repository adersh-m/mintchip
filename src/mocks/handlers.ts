import { setupWorker, rest } from 'msw';
import type { Transaction } from '../features/transactions/types';
import type { Budget } from '../features/budgets/types';
import type { CategoryReport, TimelineReport } from '../features/reports/types';

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
    }),

    // Report endpoints
    rest.get('/api/reports/category', (req, res, ctx) => {
        console.log('MSW: GET /api/reports/category');
        const startDate = req.url.searchParams.get('startDate');
        const endDate = req.url.searchParams.get('endDate');
        const category = req.url.searchParams.get('category');
        
        console.log('MSW: Report params:', { startDate, endDate, category });
        
        // Filter transactions by date range and category
        const filteredTransactions = mockTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            const start = startDate ? new Date(startDate) : new Date('1900-01-01');
            const end = endDate ? new Date(endDate) : new Date('2100-12-31');
            
            const inDateRange = transactionDate >= start && transactionDate <= end;
            const inCategory = !category || t.category === category;
            
            return inDateRange && inCategory;
        });
        
        // Group by category
        const categoryTotals = filteredTransactions.reduce((acc, t) => {
            if (!acc[t.category]) {
                acc[t.category] = { totalAmount: 0, transactionCount: 0 };
            }
            acc[t.category].totalAmount += t.amount;
            acc[t.category].transactionCount += 1;
            return acc;
        }, {} as Record<string, { totalAmount: number; transactionCount: number }>);
        
        const totalAmount = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.totalAmount, 0);
        
        const categories = Object.entries(categoryTotals).map(([category, data]) => ({
            category,
            totalAmount: data.totalAmount,
            transactionCount: data.transactionCount,
            percentage: totalAmount > 0 ? Math.round((data.totalAmount / totalAmount) * 100) : 0
        }));
        
        const categoryReport: CategoryReport = {
            categories,
            totalAmount,
            period: {
                start: startDate || '1900-01-01',
                end: endDate || '2100-12-31'
            }
        };
        
        console.log('MSW: Returning category report:', categoryReport);
        return res(
            ctx.delay(200),
            ctx.json(categoryReport)
        );
    }),

    rest.get('/api/reports/timeline', (req, res, ctx) => {
        console.log('MSW: GET /api/reports/timeline');
        const startDate = req.url.searchParams.get('startDate');
        const endDate = req.url.searchParams.get('endDate');
        const category = req.url.searchParams.get('category');
        
        console.log('MSW: Report params:', { startDate, endDate, category });
        
        // Filter transactions by date range and category
        const filteredTransactions = mockTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            const start = startDate ? new Date(startDate) : new Date('1900-01-01');
            const end = endDate ? new Date(endDate) : new Date('2100-12-31');
            
            const inDateRange = transactionDate >= start && transactionDate <= end;
            const inCategory = !category || t.category === category;
            
            return inDateRange && inCategory;
        });
        
        // Group by date
        const dateMap = filteredTransactions.reduce((acc, t) => {
            const date = t.date;
            if (!acc[date]) {
                acc[date] = { totalAmount: 0, transactionCount: 0, categories: {} };
            }
            acc[date].totalAmount += t.amount;
            acc[date].transactionCount += 1;
            acc[date].categories[t.category] = (acc[date].categories[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, { totalAmount: number; transactionCount: number; categories: Record<string, number> }>);
        
        const timeline = Object.entries(dateMap).map(([date, data]) => ({
            date,
            totalAmount: data.totalAmount,
            transactionCount: data.transactionCount,
            categories: data.categories
        })).sort((a, b) => a.date.localeCompare(b.date));
        
        const totalAmount = timeline.reduce((sum, day) => sum + day.totalAmount, 0);
        const allCategories = Array.from(new Set(filteredTransactions.map(t => t.category)));
        
        const timelineReport: TimelineReport = {
            timeline,
            totalAmount,
            period: {
                start: startDate || '1900-01-01',
                end: endDate || '2100-12-31'
            },
            categories: allCategories
        };
        
        console.log('MSW: Returning timeline report:', timelineReport);
        return res(
            ctx.delay(200),
            ctx.json(timelineReport)
        );
    })
];

export const worker = setupWorker(...handlers);
