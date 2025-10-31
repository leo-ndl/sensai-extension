
import React from 'react';

interface RoadmapInfo {
  topic: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmaps: RoadmapInfo[];
  currentIndex: number;
  onSwitch: (index: number) => void;
  onDelete: (index: number) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, roadmaps, currentIndex, onSwitch, onDelete }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg p-8 text-white relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
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

        <h2 className="text-3xl font-bold mb-6 text-center text-sky-300">Roadmap History</h2>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {roadmaps.length > 0 ? roadmaps.map((roadmap, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                index === currentIndex ? 'bg-sky-500/10 border border-sky-500/50' : 'bg-slate-700/50 border border-transparent hover:bg-slate-700'
              }`}
            >
              <p className={`font-semibold truncate ${index === currentIndex ? 'text-sky-300' : 'text-slate-200'}`} title={roadmap.topic}>
                {roadmap.topic}
              </p>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {index === currentIndex ? (
                  <span className="text-xs font-bold text-sky-400 px-2 py-1 rounded-full bg-sky-500/20">ACTIVE</span>
                ) : (
                  <button
                    onClick={() => onSwitch(index)}
                    className="text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 px-3 py-1 rounded-md transition-colors"
                  >
                    Load
                  </button>
                )}
                <button
                  onClick={() => onDelete(index)}
                  disabled={roadmaps.length <= 1}
                  className="p-2 rounded-full text-slate-400 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                  title={roadmaps.length <= 1 ? "Cannot delete the only roadmap" : "Delete roadmap"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )) : (
            <p className="text-center text-slate-400 py-8">No roadmaps in history.</p>
          )}
        </div>
        
        <style>
          {`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out forwards;
            }
            @keyframes fade-in-up {
              0% {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
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

export default HistoryModal;
