
import React from 'react';
import { Level, LevelStatus } from '../types';

interface LevelModalProps {
  level: Level;
  onClose: () => void;
  onStartLevel: (id: number) => void;
}

const LevelModal: React.FC<LevelModalProps> = ({ level, onClose, onStartLevel }) => {

  const getStatusBadgeClasses = () => {
    switch (level.status) {
      case LevelStatus.Active:
        return 'bg-sky-500/20 text-sky-300 border border-sky-500';
      case LevelStatus.Completed:
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500';
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500';
    }
  };

  const handleStartClick = () => {
    onStartLevel(level.id);
  };
  
  const formattedStatus = level.status.charAt(0).toUpperCase() + level.status.slice(1);

  const actionButton = level.status === LevelStatus.Active ? (
    <button
      onClick={handleStartClick}
      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-300"
    >
      Start Level
    </button>
  ) : (
    <button
      onClick={onClose}
      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-300"
    >
      Review Level
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center text-white relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${getStatusBadgeClasses()}`}>
          {formattedStatus}
        </span>
        
        <h2 className="text-3xl font-bold mb-2">{level.title}</h2>

        <div className="text-slate-400">
          <span>Est. Time: {level.estimatedTime}</span>
        </div>

        <div className="my-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <p className="text-slate-200 text-lg leading-relaxed">{level.description}</p>
        </div>
        
        {actionButton}

        <style>
          {`
            @keyframes fade-in-up {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out forwards;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default LevelModal;
