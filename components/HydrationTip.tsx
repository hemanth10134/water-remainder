
import React, { useState } from 'react';
import { getHydrationFact } from '../services/geminiService.ts';

const LightbulbIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15.09 16.05A6.49 6.49 0 0 1 8.95 9.91a6.5 6.5 0 0 1 6.14-5.9V2h-2v2.05A8.5 8.5 0 0 0 5 12.5c0 4.42 3.58 8 8 8s8-3.58 8-8c0-1.09-.22-2.14-.62-3.09"></path><path d="M12 21a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Z"></path></svg>
);

const HydrationTip: React.FC = () => {
  const [tip, setTip] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // The Gemini API feature is only enabled if an API key is provided.
  if (!process.env.API_KEY) {
    return null;
  }

  const fetchTip = async () => {
    setIsLoading(true);
    setError('');
    setIsModalOpen(true);
    try {
      const fact = await getHydrationFact();
      setTip(fact);
    } catch (err: any) {
      setError('Could not fetch a tip right now. Please try again later.');
      setTip('');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset state after the modal is closed
    setTimeout(() => {
        setTip('');
        setError('');
    }, 300);
  }

  return (
    <>
      <button
        onClick={fetchTip}
        className="w-full flex items-center justify-center py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold text-sky-300 transition-colors"
      >
        <LightbulbIcon className="w-5 h-5 mr-2" />
        Get a Hydration Tip
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-sm text-center transform transition-all" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-sky-400 mb-4">Hydration Tip</h3>
            {isLoading && <div className="animate-pulse text-slate-400">Thinking of a good one...</div>}
            {error && <p className="text-red-400">{error}</p>}
            {tip && <p className="text-slate-200 text-lg leading-relaxed">{tip}</p>}
            <button
              onClick={closeModal}
              className="mt-6 bg-sky-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-600 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HydrationTip;
