
import React from 'react';

interface RoadmapCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
}

const RoadmapCompleteModal: React.FC<RoadmapCompleteModalProps> = ({ isOpen, onClose, topic }) => {
    if (!isOpen) {
        return null;
    }

    const TrophyIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v1a1 1 0 001 1h12a1 1 0 001-1v-1a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM5 9a4 4 0 014-4s0 0 0 0 4 1.791 4 4v2.586l1 1V8a5 5 0 00-10 0v4.586l1-1V9z" />
            <path d="M10 18a3 3 0 01-3-3V8a3 3 0 013-3s0 0 0 0 3 1.343 3 3v7a3 3 0 01-3 3z" />
        </svg>
    );

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-slate-800 border-2 border-amber-400 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center text-white relative animate-fade-in-up-scale"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center mb-4">
                    <TrophyIcon />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-amber-300">Roadmap Complete!</h2>
                <p className="text-slate-300 text-lg mb-6">
                    Congratulations! You've mastered the <span className="font-bold text-white">{topic}</span> roadmap.
                </p>

                <button
                    onClick={onClose}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-300"
                >
                    Awesome!
                </button>

                <style>
                {`
                    @keyframes fade-in {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.3s ease-out forwards;
                    }
                    @keyframes fade-in-up-scale {
                        0% {
                            opacity: 0;
                            transform: translateY(20px) scale(0.9);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    .animate-fade-in-up-scale {
                        animation: fade-in-up-scale 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    }
                `}
                </style>
            </div>
        </div>
    );
};

export default RoadmapCompleteModal;
