
import React from 'react';
import { Level, LevelStatus, LevelType } from '../types';

interface LevelNodeProps {
  level: Level;
  onNodeClick: (level: Level) => void;
}

const LevelNode: React.FC<LevelNodeProps> = ({ level, onNodeClick }) => {
  const isLocked = level.status === LevelStatus.Locked;

  const getStatusClasses = () => {
    switch (level.status) {
      case LevelStatus.Locked:
        return 'bg-slate-700 border-slate-600 cursor-not-allowed opacity-75';
      case LevelStatus.Active:
        return 'border-sky-400 animate-pulse-glow shadow-lg shadow-sky-500/50';
      case LevelStatus.Completed:
        return 'border-emerald-400 shadow-lg shadow-emerald-500/50 shimmer-effect';
      default:
        return '';
    }
  };
  
  const getTypeClasses = () => {
     let typeClass = 'w-24 h-24 ';
     let bgClass = '';
     
     switch (level.type) {
         case LevelType.Standard:
            bgClass = level.status === LevelStatus.Completed ? 'bg-emerald-500' : 'bg-sky-500';
            break;
         case LevelType.Checkpoint:
            typeClass = 'w-28 h-28 ';
            bgClass = 'bg-purple-600';
            break;
         case LevelType.Bonus:
            bgClass = 'bg-amber-500';
            break;
     }

     if(level.status === LevelStatus.Locked) {
        if(level.type === LevelType.Checkpoint) bgClass = 'bg-purple-900/50';
        else if (level.type === LevelType.Bonus) bgClass = 'bg-amber-900/50';
        else bgClass = '';
     }

     return typeClass + bgClass;
  }

  const baseClasses = `rounded-full flex items-center justify-center border-4 transition-all duration-300 transform group relative overflow-hidden`;
  const interactiveClasses = isLocked ? '' : 'hover:scale-110 hover:-translate-y-1';
  
  const nodeClasses = `${baseClasses} ${getTypeClasses()} ${getStatusClasses()} ${interactiveClasses}`;

  const handleClick = () => {
    if (!isLocked) {
      onNodeClick(level);
    }
  };
  
  const formattedStatus = level.status.charAt(0).toUpperCase() + level.status.slice(1);

  return (
    <div className="flex flex-col items-center space-y-2">
      <button onClick={handleClick} className={nodeClasses} disabled={isLocked} aria-label={`Level ${level.id} - ${level.title}: Status ${level.status}`}>
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm px-3 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
          Level {level.id} - {level.title}: <span className="font-semibold">{formattedStatus}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
        </div>
        <div className="icon-container">
          {level.icon}
        </div>
      </button>
       {level.type === LevelType.Checkpoint && (
        <h3 className="text-lg font-bold text-purple-300 mt-4">{level.title}</h3>
      )}
    </div>
  );
};

export default LevelNode;
