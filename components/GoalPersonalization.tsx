import React, { useState } from 'react';
import { LoaderIcon } from './icons';

interface GoalPersonalizationProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: { weight: number; age: number; gender: string }) => void;
  onClose: () => void;
}

const GoalPersonalization: React.FC<GoalPersonalizationProps> = ({ isOpen, isLoading, error, onSubmit, onClose }) => {
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !age || Number(weight) <= 0 || Number(age) <= 0) {
        return;
    }
    onSubmit({ weight: Number(weight), age: Number(age), gender });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="personalize-goal-title">
      <div className="glass-modal rounded-3xl shadow-2xl p-6 w-full max-w-sm transform transition-all" onClick={e => e.stopPropagation()}>
        <h3 id="personalize-goal-title" className="text-2xl font-bold text-[var(--text-primary)] text-center mb-2">Personalize Your Goal</h3>
        <p className="text-[var(--text-secondary)] text-center mb-6">Let AI estimate your daily water goal.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="weight" className="block text-left text-sm font-medium text-[var(--text-secondary)] mb-1">Weight (kg)</label>
                <input 
                    type="number" 
                    id="weight" 
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="e.g., 70"
                    required
                    min="1"
                    className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--glow-color)]"
                />
            </div>
             <div>
                <label htmlFor="age" className="block text-left text-sm font-medium text-[var(--text-secondary)] mb-1">Age</label>
                <input 
                    type="number" 
                    id="age"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g., 30"
                    required
                    min="1"
                    className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--glow-color)]"
                />
            </div>
             <div>
                <label htmlFor="gender" className="block text-left text-sm font-medium text-[var(--text-secondary)] mb-1">Gender</label>
                <select 
                    id="gender"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full bg-[var(--input-bg)] text-[var(--text-primary)] border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--glow-color)] appearance-none"
                >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Prefer not to say</option>
                </select>
            </div>
            {error && <p className="text-red-500 text-sm py-2 text-center">{error}</p>}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-[var(--glow-color)] text-white font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="w-5 h-5 mr-3" />
                  Calculating...
                </>
              ) : "Calculate & Set Goal"}
            </button>
        </form>
      </div>
    </div>
  );
};

export default GoalPersonalization;