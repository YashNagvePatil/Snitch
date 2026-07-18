import React from 'react';

const  SnitchLabel = ({ htmlFor, children, className = '' })  => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs uppercase tracking-widest font-semibold text-slate-400 select-none ${className}`}
    >
      {children}
    </label>
  );
}

 export default SnitchLabel;