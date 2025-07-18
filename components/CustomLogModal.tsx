import React, { useState } from 'react';
import { LoaderIcon, PlusCircleIcon } from './icons';

interface CustomLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (amount: number) => void;
}

const CustomLogModal: React.FC<CustomLogModalProps> = ({ isOpen, onLog, onClose }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (numAmount > 0) {
      onLog(numAmount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="custom-log-title">
      <div className="glass-modal rounded-3xl shadow-2xl p-6 w-full max-w-xs text-center transform transition-all" onClick={e => e.stopPropagation()}>
        <h3 id="custom-log-title" className="text-xl font-bold text-[var(--text-primary)] mb-4">Log Custom Amount</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="custom-amount" className="sr-only">Amount (ml)</label>
                <div className="relative">
                    <input 
                        type="number" 
                        id="custom-amount" 
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="e.g., 500"
                        required
                        min="1"
                        autoFocus
                        className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border-none rounded-lg p-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-[var(--glow-color)]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">ml</span>
                </div>
            </div>
            <button
                type="submit"
                className="w-full mt-2 bg-[var(--glow-color)] text-white font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
            >
              Log Water
            </button>
        </form>
      </div>
    </div>
  );
};

export default CustomLogModal;