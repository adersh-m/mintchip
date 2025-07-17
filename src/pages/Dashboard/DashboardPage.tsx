import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to MintChip</h1>
                <p className="text-lg text-gray-600 mb-6">Your personal finance management dashboard</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h2 className="text-xl font-semibold text-blue-900 mb-2">💰 Transactions</h2>
                        <p className="text-blue-700 mb-4">Track your income and expenses</p>
                        <Link 
                            to="/transactions" 
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Manage Transactions
                        </Link>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                        <h2 className="text-xl font-semibold text-green-900 mb-2">📊 Budgets</h2>
                        <p className="text-green-700 mb-4">Set and monitor your spending limits</p>
                        <Link 
                            to="/budgets" 
                            className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                            Manage Budgets
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">₹0</div>
                        <div className="text-sm text-gray-600">Total Transactions</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">₹0</div>
                        <div className="text-sm text-gray-600">Total Budget</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">₹0</div>
                        <div className="text-sm text-gray-600">Remaining Budget</div>
                    </div>
                </div>
            </div>
        </div>
    );
}