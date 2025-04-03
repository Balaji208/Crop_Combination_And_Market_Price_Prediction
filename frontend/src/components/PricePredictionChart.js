import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PricePredictionChart = ({ predictions, timeframe, setTimeframe, formatChartData }) => {
  // Enhanced color palette with more vibrant colors
  const colors = [
    "#059669", // emerald-600
    "#0891b2", // cyan-600
    "#8b5cf6", // violet-500
    "#dc2626", // red-600
    "#ea580c", // orange-600
    "#16a34a", // green-600
    "#4f46e5", // indigo-600
    "#db2777", // pink-600
  ];

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          <div className="mt-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="font-medium">{entry.name}:</span>
                <span className="text-gray-700">₹{entry.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 mb-10 transform hover:scale-101 transition-all duration-300 border border-gray-100">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Price Predictions</h2>
      
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">
          Prediction Timeframe
        </label>
        <div className="flex flex-wrap justify-center gap-3">
          {["one_week", "one_month", "three_months", "six_months"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-5 py-2 rounded-lg font-medium shadow-md transition duration-200 ${
                timeframe === tf
                  ? "bg-green-600 text-white hover:bg-green-700 ring-2 ring-green-200"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {tf.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10 h-80 md:h-96">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Price Trend Chart</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={formatChartData()} 
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.4} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280" 
              tick={{ fill: "#4b5563" }}
              tickLine={{ stroke: "#9ca3af" }}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fill: "#4b5563" }}
              tickLine={{ stroke: "#9ca3af" }}
              axisLine={{ stroke: "#d1d5db" }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: "15px" }}
              iconType="circle"
              iconSize={10}
            />
            {Object.keys(predictions).map((commodity, index) => (
              <Line
                key={commodity}
                type="monotone"
                dataKey={commodity}
                name={commodity.replace(/^\w/, c => c.toUpperCase())}
                stroke={colors[index % colors.length]}
                strokeWidth={2.5}
                dot={{ stroke: colors[index % colors.length], strokeWidth: 2, r: 4, fill: "white" }}
                activeDot={{ r: 8, stroke: colors[index % colors.length], strokeWidth: 2, fill: "white" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PricePredictionChart;