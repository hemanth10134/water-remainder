import React, { useEffect } from 'react';
import { SparklesIcon } from './icons';

interface ComplimentToastProps {
  message: string;
  onClear: () => void;
}

const ComplimentToast: React.FC<ComplimentToastProps> = ({ message, onClear }) => {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClear();
    }, 5000); // Display for 5 seconds

    return () => clearTimeout(timer);
  }, [message, onClear]);

  if (!message) {
    return null;
  }

  return (
    <>
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-toast-in-out">
        <div className="glass-modal rounded-2xl p-4 flex items-center gap-4">
          <SparklesIcon className="w-6 h-6 text-[var(--glow-color)] shrink-0" />
          <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">
            {message}
          </p>
        </div>
      </div>
      <style>{`
        @keyframes toast-in-out {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          10% { opacity: 1; transform: translate(-50%, 0); }
          90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -10px); }
        }
        .animate-toast-in-out {
          animation: toast-in-out 5.2s ease-in-out forwards;
        }
      `}</style>
    </>
  );
};

export default ComplimentToast;
