

import React, { useState, useRef } from 'react';
import Header from './components/Header';
import LevelNode from './components/LevelNode';
import LevelModal from './components/LevelModal';
import ProgressBar from './components/ProgressBar';
import { LEARNING_PATH, CheckIcon, StarIcon, LockIcon, CastleIcon, TreasureIcon } from './constants';
import { Level, LevelStatus, LevelType } from './types';

// Extend the Window interface to include the confetti function
declare global {
  interface Window {
    confetti: any;
  }
}

const ROW_HEIGHT = 160; // The vertical distance between nodes in pixels

// Generate positions for each level node for the desktop layout
const getDesktopPositions = (path: Level[]) => {
  let lastSide = 'right'; // Start from the center-top, pretend previous was right
  return path.map((level, index) => {
    let side;
    if (level.type === LevelType.Checkpoint) {
      side = 'center';
    } else {
      side = lastSide === 'right' ? 'left' : 'right';
      lastSide = side;
    }

    return {
      top: index * ROW_HEIGHT,
      left: side === 'left' ? '20%' : side === 'right' ? '80%' : '50%',
      transform: 'translateX(-50%)',
    };
  });
};


const Path = ({ positions }: { positions: ReturnType<typeof getDesktopPositions> }) => {
    const pathDDesktop = positions.slice(1).reduce((d, pos, index) => {
        const prevPos = positions[index];
        const y1 = prevPos.top + 56; // 56 is approx half of node height
        const y2 = pos.top + 56;
        const midY = (y1 + y2) / 2;
        
        return `${d} M ${prevPos.left} ${y1} C ${prevPos.left} ${midY}, ${pos.left} ${midY}, ${pos.left} ${y2}`;
    }, '');

    return (
        <svg
            className="absolute inset-0 w-full h-full hidden md:block"
            aria-hidden="true"
        >
            <path
                d={pathDDesktop}
                fill="none"
                stroke="#334155" // slate-700
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="1 12"
            />
        </svg>
    );
};

const App: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>(LEARNING_PATH);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const levelNodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleLevelSelect = (level: Level) => {
    if (level.status !== LevelStatus.Locked) {
      setSelectedLevel(level);

      const isMobile = window.innerWidth < 768; // Tailwind's `md` breakpoint
      const nodeKey = isMobile ? `${level.id}-mobile` : `${level.id}-desktop`;
      const node = levelNodeRefs.current[nodeKey];
      
      if (node) {
        // Use a small timeout to ensure the scroll happens smoothly after the state update
        // and doesn't conflict with other UI changes like the modal opening.
        setTimeout(() => {
          node.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }, 100);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedLevel(null);
  };
  
  const handleLevelComplete = (completedLevelId: number) => {
    let levelWasActive = false;
    setLevels(currentLevels => {
      const newLevels = currentLevels.map(l => ({...l}));
      const completedLevelIndex = newLevels.findIndex(level => level.id === completedLevelId);

      if (completedLevelIndex === -1 || newLevels[completedLevelIndex].status !== LevelStatus.Active) {
        return currentLevels;
      }
      
      levelWasActive = true;

      // Update the completed level's status and icon
      newLevels[completedLevelIndex].status = LevelStatus.Completed;
      newLevels[completedLevelIndex].icon = <CheckIcon />;
      
      const nextLevelIndex = completedLevelIndex + 1;
      if (nextLevelIndex < newLevels.length) {
        if (newLevels[nextLevelIndex].status === LevelStatus.Locked) {
            newLevels[nextLevelIndex].status = LevelStatus.Active;
            
            // Assign the correct icon when a level becomes active
            switch(newLevels[nextLevelIndex].type) {
                case LevelType.Standard:
                    newLevels[nextLevelIndex].icon = <StarIcon />;
                    break;
                case LevelType.Checkpoint:
                    newLevels[nextLevelIndex].icon = <CastleIcon />;
                    break;
                case LevelType.Bonus:
                     newLevels[nextLevelIndex].icon = <TreasureIcon />;
                    break;
                default:
                     newLevels[nextLevelIndex].icon = <LockIcon />;
            }
        }
      }
      
      return newLevels;
    });

    if (levelWasActive) {
      // Trigger confetti!
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    }

    // Close modal after action
    handleCloseModal();
  };
  
  const desktopPositions = getDesktopPositions(levels);
  const containerHeight = (levels.length) * ROW_HEIGHT;

  const completedLevelsCount = levels.filter(level => level.status === LevelStatus.Completed).length;
  const totalLevelsCount = levels.length;
  const progressPercentage = totalLevelsCount > 0 ? (completedLevelsCount / totalLevelsCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-lg mx-auto md:max-w-2xl">
            <ProgressBar 
                progress={progressPercentage} 
                completed={completedLevelsCount} 
                total={totalLevelsCount} 
            />
        </div>

        <div className="relative max-w-lg mx-auto md:max-w-2xl" style={{ height: `${containerHeight}px` }}>
          <Path positions={desktopPositions} />
          
          <div className="absolute left-1/2 -translate-x-1/2 top-14 h-[calc(100%-7rem)] w-1.5 bg-slate-700 rounded-full md:hidden"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-14 w-1.5 bg-gradient-to-b from-sky-500 to-cyan-400 rounded-full md:hidden transition-all duration-700 ease-out" style={{height: `${(completedLevelsCount / (totalLevelsCount -1)) * 100}%`}}></div>

          <div className="relative z-10">
            {levels.map((level, index) => (
              <div
                // FIX: The ref callback for a DOM element should not return a value. The assignment `levelNodeRefs.current[...] = el` implicitly returns `el`. By wrapping the assignment in curly braces, the arrow function body becomes a block and implicitly returns undefined, which satisfies the `Ref<HTMLDivElement>` type.
                ref={el => { levelNodeRefs.current[`${level.id}-mobile`] = el; }}
                key={`${level.id}-mobile`}
                className="absolute md:hidden"
                style={{ top: `${index * 150}px`, left: '50%', transform: 'translateX(-50%)' }}
              >
                <LevelNode level={level} onNodeClick={handleLevelSelect} />
              </div>
            ))}
             {levels.map((level, index) => (
              <div
                // FIX: The ref callback for a DOM element should not return a value. The assignment `levelNodeRefs.current[...] = el` implicitly returns `el`. By wrapping the assignment in curly braces, the arrow function body becomes a block and implicitly returns undefined, which satisfies the `Ref<HTMLDivElement>` type.
                ref={el => { levelNodeRefs.current[`${level.id}-desktop`] = el; }}
                key={`${level.id}-desktop`}
                className="hidden md:block absolute"
                style={desktopPositions[index]}
              >
                <LevelNode level={level} onNodeClick={handleLevelSelect} />
              </div>
            ))}
          </div>
        </div>
      </main>
      {selectedLevel && (
        <LevelModal 
            level={selectedLevel}
            onClose={handleCloseModal}
            onStartLevel={handleLevelComplete}
        />
      )}
    </div>
  );
};

export default App;