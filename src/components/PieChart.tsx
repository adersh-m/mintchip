import React, { useMemo } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategoryReport } from '../features/reports/types';

interface PieChartProps {
  data: CategoryReport;
}

// Nice color palette for the pie chart
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B',
  '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'
];

const PieChart: React.FC<PieChartProps> = React.memo(({ data }) => {
  // Transform data for Recharts with memoization
  const chartData = useMemo(() => 
    data.categories.map(category => ({
      name: category.category,
      value: category.totalAmount,
      count: category.transactionCount,
      percentage: category.percentage
    })), [data.categories]
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">{`Amount: $${data.value.toFixed(2)}`}</p>
          <p className="text-green-600">{`Transactions: ${data.count}`}</p>
          <p className="text-gray-600">{`${data.percentage.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Spending by Category</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Total Amount: <span className="font-semibold">${data.totalAmount.toFixed(2)}</span></p>
        <p>Period: {data.period.start} to {data.period.end}</p>
      </div>
    </div>
  );
});

PieChart.displayName = 'PieChart';

export { PieChart };
