
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import Header from './components/Header';
import LevelNode from './components/LevelNode';
import LevelModal from './components/LevelModal';
import ProgressBar from './components/ProgressBar';
import RoadmapGeneratorModal from './components/RoadmapGeneratorModal';
import HistoryModal from './components/HistoryModal';
import { LEARNING_PATH, CheckIcon, StarIcon, LockIcon, CastleIcon, TreasureIcon } from './constants';
import { Level, LevelStatus, LevelType, AppProgress, Roadmap } from './types';

// Extend the Window interface to include the confetti function
declare global {
  interface Window {
    confetti: any;
  }
}

const LOCAL_STORAGE_KEY = 'learningAppProgress';
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

const getIconForLevel = (level: Level): React.ReactNode => {
    if (level.status === LevelStatus.Completed) {
        return <CheckIcon />;
    }
    if (level.status === LevelStatus.Locked) {
        if (level.type === LevelType.Checkpoint) return <CastleIcon />;
        if (level.type === LevelType.Bonus) return <TreasureIcon />;
        return <LockIcon />;
    }
    // Active status
    switch (level.type) {
        case LevelType.Standard: return <StarIcon />;
        case LevelType.Checkpoint: return <CastleIcon />;
        case LevelType.Bonus: return <TreasureIcon />;
        default: return <StarIcon />;
    }
};

const App: React.FC = () => {
  const [progress, setProgress] = useState<AppProgress>(() => {
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedProgress) {
        const parsedProgress: AppProgress = JSON.parse(savedProgress);
        // Re-assign icons as they are not serializable
        parsedProgress.roadmaps.forEach(roadmap => {
          roadmap.levels.forEach(level => {
            level.icon = getIconForLevel(level);
          });
        });
        return parsedProgress;
      }
    } catch (error) {
      console.error("Could not load progress from local storage", error);
    }
    // Default initial state
    return {
      roadmaps: [{ topic: 'Default Path', levels: LEARNING_PATH }],
      currentIndex: 0
    };
  });

  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const levelNodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    try {
      // Create a serializable version of the progress without React nodes
      const progressToSave = {
        ...progress,
        roadmaps: progress.roadmaps.map(roadmap => ({
          ...roadmap,
          levels: roadmap.levels.map(({ icon, ...level }) => level)
        }))
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progressToSave));
    } catch (error) {
      console.error("Could not save progress to local storage", error);
    }
  }, [progress]);
  
  const activeRoadmap = progress.roadmaps[progress.currentIndex];
  const levels = activeRoadmap.levels;

  const handleLevelSelect = (level: Level) => {
    if (level.status !== LevelStatus.Locked) {
      setSelectedLevel(level);

      const isMobile = window.innerWidth < 768; // Tailwind's `md` breakpoint
      const nodeKey = isMobile ? `${level.id}-mobile` : `${level.id}-desktop`;
      const node = levelNodeRefs.current[nodeKey];
      
      if (node) {
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
    
    setProgress(currentProgress => {
      // Deep copy to avoid mutation
      const newProgress: AppProgress = JSON.parse(JSON.stringify(currentProgress));
      const currentRoadmap = newProgress.roadmaps[newProgress.currentIndex];
      const newLevels = currentRoadmap.levels;

      const completedLevelIndex = newLevels.findIndex(level => level.id === completedLevelId);

      if (completedLevelIndex === -1 || newLevels[completedLevelIndex].status !== LevelStatus.Active) {
        return currentProgress; // No change
      }
      
      levelWasActive = true;

      newLevels[completedLevelIndex].status = LevelStatus.Completed;
      
      const nextLevelIndex = completedLevelIndex + 1;
      if (nextLevelIndex < newLevels.length) {
        if (newLevels[nextLevelIndex].status === LevelStatus.Locked) {
            newLevels[nextLevelIndex].status = LevelStatus.Active;
        }
      }
      
      // Re-assign icons after status changes
      newProgress.roadmaps.forEach(rdmp => rdmp.levels.forEach(lvl => {
          lvl.icon = getIconForLevel(lvl as Level);
      }));

      return newProgress;
    });

    if (levelWasActive) {
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    }

    handleCloseModal();
  };

  const handleGenerateRoadmap = async (topic: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['standard', 'checkpoint', 'bonus'] },
          description: { type: Type.STRING },
          estimatedTime: { type: Type.STRING },
        },
        required: ['title', 'type', 'description', 'estimatedTime'],
      },
    };
    
    const systemInstruction = "You are an expert curriculum designer. Your task is to generate a gamified, step-by-step learning path based on a user's request. The path should consist of between 10 to 15 steps or more if needed. It must include a mix of 'standard' lessons for core concepts, 'checkpoint' levels to test knowledge, and 'bonus' levels for fun, related topics. The final output must be a valid JSON array of objects, conforming to the provided schema. Ensure the path is logical and progressive.";
    const contents = `Generate a learning path for: ${topic}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: schema
        }
    });

    const generatedLevels = JSON.parse(response.text);
    
    const newPath: Level[] = generatedLevels.map((genLevel: any, index: number) => {
      const status = index === 0 ? LevelStatus.Active : LevelStatus.Locked;
      const newLevel: Level = {
          ...genLevel,
          id: index + 1,
          type: genLevel.type as LevelType,
          status: status,
          icon: null, // will be assigned next
      };
      newLevel.icon = getIconForLevel(newLevel);
      return newLevel;
    });

    const newRoadmap: Roadmap = { topic, levels: newPath };

    setProgress(currentProgress => {
      const newRoadmaps = [...currentProgress.roadmaps, newRoadmap];
      return {
        roadmaps: newRoadmaps,
        currentIndex: newRoadmaps.length - 1
      };
    });
    
    setIsGeneratorOpen(false);
  };

  const handleSwitchRoadmap = (index: number) => {
    setProgress(currentProgress => ({
      ...currentProgress,
      currentIndex: index,
    }));
    setIsHistoryOpen(false);
  };

  const handleDeleteRoadmap = (index: number) => {
    setProgress(currentProgress => {
      if (currentProgress.roadmaps.length <= 1) return currentProgress;

      const newRoadmaps = currentProgress.roadmaps.filter((_, i) => i !== index);
      let newIndex = currentProgress.currentIndex;

      if (index === currentProgress.currentIndex) {
        newIndex = Math.max(0, index - 1);
      } else if (index < currentProgress.currentIndex) {
        newIndex = currentProgress.currentIndex - 1;
      }
      
      return {
        roadmaps: newRoadmaps,
        currentIndex: newIndex
      };
    });
  };
  
  const desktopPositions = getDesktopPositions(levels);
  const containerHeight = (levels.length) * ROW_HEIGHT;

  const completedLevelsCount = levels.filter(level => level.status === LevelStatus.Completed).length;
  const totalLevelsCount = levels.length;
  const progressPercentage = totalLevelsCount > 0 ? (completedLevelsCount / totalLevelsCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header 
        onGenerateClick={() => setIsGeneratorOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)} 
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-lg mx-auto md:max-w-2xl">
            <ProgressBar 
                progress={progressPercentage} 
                completed={completedLevelsCount} 
                total={totalLevelsCount} 
                topic={activeRoadmap.topic}
            />
        </div>

        <div className="relative max-w-lg mx-auto md:max-w-2xl" style={{ height: `${containerHeight}px` }}>
          <Path positions={desktopPositions} />
          
          <div className="absolute left-1/2 -translate-x-1/2 top-14 h-[calc(100%-7rem)] w-1.5 bg-slate-700 rounded-full md:hidden"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-14 w-1.5 bg-gradient-to-b from-sky-500 to-cyan-400 rounded-full md:hidden transition-all duration-700 ease-out" style={{height: `${totalLevelsCount > 1 ? (completedLevelsCount / (totalLevelsCount -1)) * 100 : 0}%`}}></div>

          <div className="relative z-10">
            {levels.map((level, index) => (
              <div
                ref={el => { if(el) levelNodeRefs.current[`${level.id}-mobile`] = el; }}
                key={`${level.id}-mobile`}
                className="absolute md:hidden"
                style={{ top: `${index * 150}px`, left: '50%', transform: 'translateX(-50%)' }}
              >
                <LevelNode level={level} onNodeClick={handleLevelSelect} />
              </div>
            ))}
             {levels.map((level, index) => (
              <div
                ref={el => { if(el) levelNodeRefs.current[`${level.id}-desktop`] = el; }}
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
      <RoadmapGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerate={handleGenerateRoadmap}
      />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        roadmaps={progress.roadmaps.map(({topic}) => ({topic}))}
        currentIndex={progress.currentIndex}
        onSwitch={handleSwitchRoadmap}
        onDelete={handleDeleteRoadmap}
      />
    </div>
  );
};

export default App;
