import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function RevenueChart() {
  // Dữ liệu mẫu
  const data = [
    { month: 'T1', revenue: 0 },
    { month: 'T2', revenue: 0 },
    { month: 'T3', revenue: 0 },
    { month: 'T4', revenue: 0 },
    { month: 'T5', revenue: 0 },
    { month: 'T6', revenue: 0 },
    { month: 'T7', revenue: 0 },
    { month: 'T8', revenue: 0 },
    { month: 'T9', revenue: 0 },
    { month: 'T10', revenue: 0 },
    { month: 'T11', revenue: 0 },
    { month: 'T12', revenue: 0 }
  ];

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => 
              new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Tooltip 
            formatter={(value) => 
              new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
