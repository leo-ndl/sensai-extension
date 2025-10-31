
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import Header from './components/Header';
import LevelNode from './components/LevelNode';
import LevelModal from './components/LevelModal';
import ProgressBar from './components/ProgressBar';
import RoadmapGeneratorModal from './components/RoadmapGeneratorModal';
import RoadmapCompleteModal from './components/RoadmapCompleteModal';
import HistoryModal from './components/HistoryModal';
import { LEARNING_PATH, CheckIcon, LockIcon, CastleIcon, TreasureIcon, ReadingIcon, QuizIcon, ProjectIcon } from './constants';
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
        case LevelType.Reading: return <ReadingIcon />;
        case LevelType.Quiz: return <QuizIcon />;
        case LevelType.Project: return <ProjectIcon />;
        case LevelType.Checkpoint: return <CastleIcon />;
        case LevelType.Bonus: return <TreasureIcon />;
        default: return <ReadingIcon />;
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

        // --- Streak Validation Logic ---
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Ensure properties exist for backwards compatibility
        parsedProgress.streakCount = parsedProgress.streakCount || 0;
        parsedProgress.lastCompletedDate = parsedProgress.lastCompletedDate || null;

        if (parsedProgress.lastCompletedDate && 
            parsedProgress.lastCompletedDate !== todayStr && 
            parsedProgress.lastCompletedDate !== yesterdayStr) {
            // Streak is broken
            parsedProgress.streakCount = 0;
        }

        return parsedProgress;
      }
    } catch (error) {
      console.error("Could not load progress from local storage", error);
    }
    // Default initial state
    return {
      roadmaps: [{ topic: 'Default Path', levels: LEARNING_PATH }],
      currentIndex: 0,
      streakCount: 0,
      lastCompletedDate: null,
    };
  });

  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRoadmapCompleteModalOpen, setIsRoadmapCompleteModalOpen] = useState(false);
  const levelNodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevProgressPercentage = useRef(0);

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
  
  const completedLevelsCount = levels.filter(level => level.status === LevelStatus.Completed).length;
  const totalLevelsCount = levels.length;
  const progressPercentage = totalLevelsCount > 0 ? (completedLevelsCount / totalLevelsCount) * 100 : 0;
  
  useEffect(() => {
      if (progressPercentage === 100 && prevProgressPercentage.current < 100) {
        setIsRoadmapCompleteModalOpen(true);
        // Trigger a big confetti celebration
        if (window.confetti) {
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                const particleCount = 50 * (timeLeft / duration);
                window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
      }
      prevProgressPercentage.current = progressPercentage;
  }, [progressPercentage]);


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
    const activeLevelIndex = levels.findIndex(level => level.id === completedLevelId && level.status === LevelStatus.Active);

    // If the level is not found or not active, it's a review or an invalid action.
    if (activeLevelIndex === -1) {
      handleCloseModal();
      return;
    }
    
    // Trigger side-effects for a successful completion
    if (window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }

    setProgress(currentProgress => {
      // Deep copy to avoid mutation
      const newProgress: AppProgress = JSON.parse(JSON.stringify(currentProgress));
      const currentRoadmap = newProgress.roadmaps[newProgress.currentIndex];
      const newLevels = currentRoadmap.levels;

      // Mark as completed
      newLevels[activeLevelIndex].status = LevelStatus.Completed;
      
      // Unlock next level
      const nextLevelIndex = activeLevelIndex + 1;
      if (nextLevelIndex < newLevels.length) {
        if (newLevels[nextLevelIndex].status === LevelStatus.Locked) {
            newLevels[nextLevelIndex].status = LevelStatus.Active;
        }
      }
      
      // --- Streak Logic ---
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const todayStr = today.toISOString().split('T')[0];
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const lastDate = newProgress.lastCompletedDate;

      // Only update streak once per day on the first completion of that day
      if (lastDate !== todayStr) {
        if (lastDate === yesterdayStr) {
            // Continued the streak
            newProgress.streakCount = (newProgress.streakCount || 0) + 1;
        } else {
            // New or broken streak
            newProgress.streakCount = 1;
        }
        newProgress.lastCompletedDate = todayStr;
      }
      // --- End Streak Logic ---
      
      // Re-assign icons after status changes
      newProgress.roadmaps.forEach(rdmp => rdmp.levels.forEach(lvl => {
          lvl.icon = getIconForLevel(lvl as Level);
      }));

      return newProgress;
    });

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
          type: { type: Type.STRING, enum: ['reading', 'quiz', 'project', 'checkpoint', 'bonus'] },
          description: { type: Type.STRING },
          estimatedTime: { type: Type.STRING },
        },
        required: ['title', 'type', 'description', 'estimatedTime'],
      },
    };
    
    const systemInstruction = "You are an expert curriculum designer. Your task is to generate a gamified, step-by-step learning path based on a user's request. The path should consist of between 10 to 15 steps or more if needed. It must include a mix of 'reading' lessons for core concepts, 'quiz' levels to test knowledge, 'project' levels for hands-on application, 'checkpoint' levels to gate progress, and 'bonus' levels for fun, related topics. The final output must be a valid JSON array of objects, conforming to the provided schema. Ensure the path is logical and progressive.";
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
        ...currentProgress,
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
        ...currentProgress,
        roadmaps: newRoadmaps,
        currentIndex: newIndex
      };
    });
  };
  
  const desktopPositions = getDesktopPositions(levels);
  const containerHeight = (levels.length) * ROW_HEIGHT;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header 
        onGenerateClick={() => setIsGeneratorOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)} 
        streakCount={progress.streakCount}
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
      <RoadmapCompleteModal
        isOpen={isRoadmapCompleteModalOpen}
        onClose={() => setIsRoadmapCompleteModalOpen(false)}
        topic={activeRoadmap.topic}
      />
    </div>
  );
};

export default App;