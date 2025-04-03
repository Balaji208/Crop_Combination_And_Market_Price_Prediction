import React from 'react';

const PricePredictionTable = ({ predictions, formatChartData }) => {
  // Get formatted data
  const data = formatChartData();
  const commodities = Object.keys(predictions);

  // Function to determine price trend (for visual indicators)
  const getTrendIndicator = (currentValue, previousValue) => {
    if (!previousValue) return null;
    
    const difference = currentValue - previousValue;
    if (difference > 0) {
      return <span className="text-green-600 ml-2">▲</span>;
    } else if (difference < 0) {
      return <span className="text-red-600 ml-2">▼</span>;
    }
    return <span className="text-gray-500 ml-2">•</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-green-800 mb-6 text-center">
        Predicted Prices (₹ / Quintal)
      </h3>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-green-700 to-green-600">
              <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider rounded-tl-lg">
                Date
              </th>
              {commodities.map((commodity, index) => (
                <th
                  key={commodity}
                  className={`px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider ${
                    index === commodities.length - 1 ? 'rounded-tr-lg' : ''
                  }`}
                >
                  {commodity.replace(/^\w/, c => c.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => {
              // Get previous row for trend comparison
              const prevRow = rowIndex > 0 ? data[rowIndex - 1] : null;
              
              return (
                <tr 
                  key={rowIndex} 
                  className={`transition duration-150 hover:bg-gray-50 ${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{row.date}</span>
                  </td>
                  
                  {commodities.map((commodity) => {
                    const value = row[commodity];
                    const prevValue = prevRow ? prevRow[commodity] : null;
                    const trendIndicator = getTrendIndicator(value, prevValue);
                    
                    return (
                      <td
                        key={`${row.date}-${commodity}`}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-800">
                            {value ? `₹ ${value.toFixed(2)}` : "N/A"}
                          </span>
                          {trendIndicator}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 flex justify-end">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-green-600 mr-1">▲</span> Increasing
          </div>
          <div className="flex items-center">
            <span className="text-red-600 mr-1">▼</span> Decreasing
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">•</span> No change
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricePredictionTable;