import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
    const location = useLocation();
    
    const navItems = [
        { path: '/', label: 'Dashboard', icon: '🏠' },
        { path: '/transactions', label: 'Transactions', icon: '💰' },
        { path: '/budgets', label: 'Budgets', icon: '📊' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-indigo-600">MintChip</h1>
                        </div>
                        <div className="ml-6 flex space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        location.pathname === item.path
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
