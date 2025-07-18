import React, { useState } from 'react';
import { getHydrationFact } from '../services/geminiService';
import { WaterDropIcon, LoaderIcon } from './icons';

const HydrationTip: React.FC = () => {
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (!process.env.API_KEY) {
    return null;
  }

  const fetchTip = async () => {
    setIsLoading(true);
    setError('');
    setTip('');
    setIsModalOpen(true);
    try {
      const fact = await getHydrationFact();
      setTip(fact);
    } catch (err: any) {
      setError('Could not fetch a tip right now. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={fetchTip}
        className="w-full h-full rounded-full floating-pod flex items-center justify-center"
        aria-label="Get a hydration tip"
      >
        <WaterDropIcon className="w-8 h-8 text-[var(--text-secondary)]" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="glass-modal rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Hydration Tip</h3>
            <div className="min-h-[80px] flex items-center justify-center">
              {isLoading && <LoaderIcon className="w-8 h-8 text-[var(--glow-color)]" />}
              {error && <p className="text-red-500">{error}</p>}
              {tip && <p className="text-[var(--text-secondary)] text-lg leading-relaxed">{tip}</p>}
            </div>
            <button
              onClick={closeModal}
              className="mt-6 bg-[var(--glow-color)] text-white font-bold py-2 px-8 rounded-full hover:opacity-90 transition-opacity"
            >
              Cool!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HydrationTip;