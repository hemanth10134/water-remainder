import React from 'react';
import { ShareIcon } from './icons';

interface IOSInstallPromptProps {
    isOpen: boolean;
    onClose: () => void;
}

const IOSInstallPrompt: React.FC<IOSInstallPromptProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in-up" role="dialog" aria-labelledby="ios-install-title">
            <div className="glass-modal rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex-grow">
                    <h3 id="ios-install-title" className="font-bold text-sm text-[var(--text-primary)]">Get the Full Experience</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                        For notifications on iOS, add this app to your Home Screen. Tap the <ShareIcon className="inline-block w-3 h-3 mx-0.5" /> button and then 'Add to Home Screen'.
                    </p>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-xs font-semibold text-[var(--text-secondary)] bg-[var(--input-bg)] px-3 py-1.5 rounded-lg shrink-0"
                    aria-label="Dismiss install prompt"
                >
                    Dismiss
                </button>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default IOSInstallPrompt;
