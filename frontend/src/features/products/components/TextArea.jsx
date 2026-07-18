import React from 'react';

const  SnitchTextarea = ({ className = '', rows = 4, ...props }) => {
  return (
    <textarea
      rows={rows}
      className={`w-full bg-transparent border-b border-slate-700 rounded-none px-0 py-2.5 text-white placeholder:text-slate-600 focus:border-amber-600 focus:outline-none focus:ring-0 transition-colors resize-none text-base leading-relaxed font-light tracking-wide ${className}`}
      {...props}
    />
  );
}

export default SnitchTextarea