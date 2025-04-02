import React from 'react';

const ErrorMessage = ({ error }) => (
  error ? <p className="text-red-500 mt-4 text-center">{error}</p> : null
);

export default ErrorMessage;