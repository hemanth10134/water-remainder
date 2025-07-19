import React from 'react';

const RefreshCwIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 2v6h6"></path>
    <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
    <path d="M21 22v-6h-6"></path>
    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
  </svg>
);

interface HeaderProps {
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="w-full flex justify-between items-center">
        <div className="flex items-center space-x-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"></path></svg>
             <h1 className="text-2xl font-bold text-slate-100">HydroPal</h1>
        </div>
      <button onClick={onReset} className="p-2 text-slate-400 hover:text-white transition-colors duration-200" aria-label="Reset Progress">
        <RefreshCwIcon className="w-5 h-5" />
      </button>
    </header>
  );
};
