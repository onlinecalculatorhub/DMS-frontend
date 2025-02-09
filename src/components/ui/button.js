// src/components/ui/button.js

import React from 'react';

export const Button = ({ onClick, children, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
