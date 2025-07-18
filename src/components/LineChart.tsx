import React, { useMemo } from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { TimelineReport } from '../features/reports/types';

interface LineChartProps {
  data: TimelineReport;
}

// Color palette for different categories
const CATEGORY_COLORS = {
  'Food': '#FF6B6B',
  'Transport': '#4ECDC4', 
  'Entertainment': '#45B7D1',
  'Utilities': '#96CEB4',
  'Shopping': '#FFEAA7',
  'Healthcare': '#DDA0DD',
  'Education': '#98D8C8',
  'Other': '#F7DC6F'
};

const LineChart: React.FC<LineChartProps> = React.memo(({ data }) => {
  // Transform data for Recharts with memoization
  const chartData = useMemo(() => 
    data.timeline.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      fullDate: item.date,
      totalAmount: item.totalAmount,
      transactionCount: item.transactionCount,
      ...item.categories
    })), [data.timeline]
  );

  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        date: string;
        fullDate: string;
        totalAmount: number;
        transactionCount: number;
        [key: string]: unknown;
      };
    }>;
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">{`Total: $${data.totalAmount.toFixed(2)}`}</p>
          <p className="text-gray-600">{`Transactions: ${data.transactionCount}`}</p>
          <div className="mt-2 space-y-1">
            {Object.entries(data)
              .filter(([key]) => key !== 'date' && key !== 'fullDate' && key !== 'totalAmount' && key !== 'transactionCount')
              .map(([category, amount]) => (
                <p key={category} className="text-sm">
                  <span className="font-medium">{category}:</span> ${(amount as number).toFixed(2)}
                </p>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Spending Timeline</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Main total line */}
            <Line 
              type="monotone" 
              dataKey="totalAmount" 
              stroke="#2563EB" 
              strokeWidth={3}
              name="Total Amount"
              dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
            />
            
            {/* Category lines */}
            {data.categories.map((category) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#8884d8'}
                strokeWidth={2}
                name={category}
                dot={{ fill: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#8884d8', strokeWidth: 1, r: 3 }}
                connectNulls={false}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Total Amount: <span className="font-semibold">${data.totalAmount.toFixed(2)}</span></p>
        <p>Period: {data.period.start} to {data.period.end}</p>
        <p>Categories: {data.categories.join(', ')}</p>
      </div>
    </div>
  );
});

LineChart.displayName = 'LineChart';

export { LineChart };
