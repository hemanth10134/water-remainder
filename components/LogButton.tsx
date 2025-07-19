import React from 'react';
import { WATER_LOG_AMOUNT_ML } from '../constants.ts';

const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);


interface LogButtonProps {
  onLog: () => void;
  disabled: boolean;
}

export const LogButton: React.FC<LogButtonProps> = ({ onLog, disabled }) => {
  return (
    <button
      onClick={onLog}
      disabled={disabled}
      className="flex items-center justify-center w-48 h-16 bg-sky-500 rounded-full text-white font-bold text-lg transition-all duration-300 ease-in-out shadow-lg hover:bg-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-500 focus:ring-opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
    >
        {disabled ? (
            'Goal Reached!'
        ) : (
            <>
                <PlusIcon className="w-6 h-6 mr-2" />
                <span>{WATER_LOG_AMOUNT_ML} ml</span>
            </>
        )}
    </button>
  );
};
