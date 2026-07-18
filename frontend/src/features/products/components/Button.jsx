import React from 'react';

const  SnitchButton = ({ children, className = '', isLoading, disabled, ...props }) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 tracking-wide shadow-lg shadow-amber-950/20 ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}

 export default SnitchButton