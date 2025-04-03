import React from 'react';

const NoPredictionsMessage = () => (
  <div className="flex flex-col items-center justify-center p-8 my-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
    <svg 
      className="w-16 h-16 text-gray-400 mb-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Price Predictions Available</h3>
    <p className="text-gray-600 text-center max-w-md">
      No price data could be predicted for any selected commodities. Please try different parameters.
    </p>
  </div>
);

export default NoPredictionsMessage;