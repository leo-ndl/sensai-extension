
import React from 'react';

interface ProgressBarProps {
  progress: number;
  completed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, completed, total }) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-2 text-sm">
        <h2 className="font-bold text-sky-300 tracking-wide">Overall Progress</h2>
        <span className="font-semibold text-slate-300">{`${completed} / ${total} Levels`}</span>
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
