import React from 'react';

const FailedPredictions = ({ failedPredictions }) => {
  // Count the number of failed predictions
  const failureCount = Object.keys(failedPredictions).length;
  
  // If no failures, return null or optional empty state
  if (failureCount === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border border-red-100 transform hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-red-100 p-3 rounded-full mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-700">Failed Predictions ({failureCount})</h2>
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
        <p className="text-red-800 text-sm">
          The following commodities could not be predicted. This may be due to insufficient historical data or other technical issues.
        </p>
      </div>
      
      <ul className="space-y-4 max-w-3xl mx-auto">
        {Object.entries(failedPredictions).map(([commodity, errorMsg]) => (
          <li 
            key={commodity} 
            className="flex items-start bg-gradient-to-r from-red-50 to-white p-4 rounded-lg shadow-sm border-l-4 border-red-400 hover:shadow-md transition-all duration-200"
          >
            <div className="flex-shrink-0 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="font-bold text-red-700 mb-1 sm:mb-0">{commodity}</span>
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  Error Code: {Math.abs(errorMsg.length % 1000)}
                </span>
              </div>
              <p className="text-gray-700 mt-1 text-sm">{errorMsg}</p>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="mt-6 text-center">
        <button 
          className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
              clipRule="evenodd" 
            />
          </svg>
          Retry Failed Predictions
        </button>
      </div>
    </div>
  );
};

export default FailedPredictions;