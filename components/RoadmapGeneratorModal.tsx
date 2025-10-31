
import React, { useState } from 'react';

interface RoadmapGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: string) => Promise<void>;
}

const RoadmapGeneratorModal: React.FC<RoadmapGeneratorModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleGenerateClick = async () => {
    if (!topic.trim()) {
      setError('Please describe the learning path you want to create.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onGenerate(topic);
      setTopic(''); // Reset topic on success
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    if (isLoading) return;
    setTopic('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg p-8 text-white relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold mb-3 text-center text-sky-300">Generate New Learning Path</h2>
        <p className="text-slate-400 mb-6 text-center">Describe what you want to learn, and AI will create a custom path for you.</p>

        <div className="space-y-4">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., A 12-step journey to learn Astrophysics, from the Big Bang to black holes."
            className="w-full h-32 p-3 bg-slate-900 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none"
            disabled={isLoading}
            aria-label="Topic for new learning path"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            onClick={handleGenerateClick}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-300 flex items-center justify-center disabled:bg-sky-800/50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate with AI'
            )}
          </button>
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

export default RoadmapGeneratorModal;
