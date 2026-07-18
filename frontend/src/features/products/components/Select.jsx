import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const SelectContext = createContext(null);

// 1. Core Wrapper Component
export function SnitchSelect({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  const [optionsMap, setOptionsMap] = useState({});
  const containerRef = useRef(null);

  // Safely register item labels so the trigger can display them
  const registerOption = useCallback((val, label) => {
    setOptionsMap(prev => {
      if (prev[val] === label) return prev;
      return { ...prev, [val]: label };
    });
  }, []);

  // Close drop menu when clicking anywhere outside
  useEffect(() => {
    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, optionsMap, registerOption }}>
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// 2. Interactive Trigger Button
export function SnitchSelectTrigger({ children, className = '' }) {
  const { open, setOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`w-full flex items-center justify-between bg-transparent border-b border-slate-700 rounded-none px-0 py-2.5 text-white text-left focus:outline-none focus:border-amber-600 transition-colors group text-base ${className}`}
    >
      {children}
      <svg
        className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform duration-300 ease-out ${
          open ? 'rotate-180 text-amber-500' : ''
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// 3. Dynamic Value Displayer
export function SnitchSelectValue({ placeholder = 'Select an option' }) {
  const { value, optionsMap } = useContext(SelectContext);

  return (
    <span className={`block truncate tracking-wide ${!value ? 'text-slate-600' : 'text-white'}`}>
      {value ? optionsMap[value] || value : placeholder}
    </span>
  );
}

// 4. Dropdown Floating Wrapper Panel
export function SnitchSelectContent({ children, className = '' }) {
  const { open } = useContext(SelectContext);

  if (!open) return null;

  return (
    <div
      className={`absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-slate-900/95 border border-slate-800/80 backdrop-blur-md rounded-md shadow-2xl z-50 py-1.5 scrollbar-thin scrollbar-thumb-slate-800 animate-in fade-in slide-in-from-top-1 duration-150 ${className}`}
    >
      {children}
    </div>
  );
}

// 5. Selectable List Item Row
export function SnitchSelectItem({ value, children, className = '' }) {
  const { value: selectedValue, onValueChange, setOpen, registerOption } = useContext(SelectContext);

  // Register the inner content text/label on layout mount
  useEffect(() => {
    if (registerOption && children) {
      registerOption(value, children.toString());
    }
  }, [value, children, registerOption]);

  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className={`w-full text-left px-4 py-2.5 text-sm font-light tracking-wide transition-colors flex items-center justify-between outline-none ${
        isSelected
          ? 'bg-slate-800/50 text-amber-500 font-medium'
          : 'text-slate-400 hover:bg-slate-800/30 hover:text-white'
      } ${className}`}
    >
      <span>{children}</span>
      {isSelected && (
        <svg
          className="w-4 h-4 text-amber-500 animate-in zoom-in-75 duration-150"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}