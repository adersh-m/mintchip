import React, { useState, useCallback, useMemo } from 'react';
import { useGetCategoryReportQuery, useGetTimelineReportQuery } from '../features/reports/api';
import { PieChart } from '../components/PieChart';
import { LineChart } from '../components/LineChart';

const ReportsPage: React.FC = () => {
    // Default to current month with memoization
    const defaultDateRange = useMemo(() => {
        const currentDate = new Date();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        return {
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0]
        };
    }, []);
    
    const [dateRange, setDateRange] = useState(defaultDateRange);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

    // Memoize query parameters to prevent unnecessary re-renders
    const queryParams = useMemo(() => ({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        category: selectedCategory
    }), [dateRange.startDate, dateRange.endDate, selectedCategory]);

    const { data: categoryReport, isLoading: categoryLoading, error: categoryError } = useGetCategoryReportQuery(queryParams);
    const { data: timelineReport, isLoading: timelineLoading, error: timelineError } = useGetTimelineReportQuery(queryParams);

    const handleDateRangeChange = useCallback((field: 'startDate' | 'endDate', value: string) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const clearCategoryFilter = useCallback(() => {
        setSelectedCategory(undefined);
    }, []);

    if (categoryLoading || timelineLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading reports...</p>
                </div>
            </div>
        );
    }

    if (categoryError || timelineError) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-gray-600">Error loading reports. Please try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
                    <p className="text-gray-600">Analyze your spending patterns and trends</p>
                </div>

                {/* Date Range Controls */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                                Start Date:
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                                End Date:
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {selectedCategory && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">
                                    Filtered by: <span className="font-medium">{selectedCategory}</span>
                                </span>
                                <button
                                    onClick={clearCategoryFilter}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {categoryReport && <PieChart data={categoryReport} />}
                    {timelineReport && <LineChart data={timelineReport} />}
                </div>

                {/* No Data Message */}
                {(!categoryReport || categoryReport.categories.length === 0) && (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
                        <p className="text-gray-600">No transactions found for the selected date range.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;