
import React from 'react';

interface ProgressBarProps {
  progress: number;
  completed: number;
  total: number;
  topic: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, completed, total, topic }) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-sky-300 tracking-wide text-lg">{topic}</h2>
        <span className="font-semibold text-slate-300 text-sm">{`${completed} / ${total} Levels`}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3 border-2 border-slate-600 overflow-hidden" title={`Progress: ${Math.round(progress)}%`}>
        <div
          className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Learning path progress"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
