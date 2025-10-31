
import React from 'react';

interface HeaderProps {
  onGenerateClick: () => void;
  onHistoryClick: () => void;
  streakCount: number;
}

const Header: React.FC<HeaderProps> = ({ onGenerateClick, onHistoryClick, streakCount }) => {
  const FlameIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM10 2a1 1 0 011 1v3.268l1.83 5.49a1 1 0 11-1.83.614L10 8.268V3a1 1 0 011-1zm-1 11a1 1 0 00-1 1v.054l-1.622-4.867a1 1 0 10-1.898.632l2.25 6.75a1 1 0 00.946.685h3.352a1 1 0 00.946-.685l.75-2.25a1 1 0 10-1.898-.632L9 13.054V13z" clipRule="evenodd" />
    </svg>
  );
  
  const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1.586l-1.293 1.293a1 1 0 001.414 1.414L5 6.414V8a1 1 0 002 0V6.414l.293.293a1 1 0 001.414-1.414L7.414 4.586V3a1 1 0 00-1-1H5zM15 2a1 1 0 00-1 1v1.586l-1.293 1.293a1 1 0 101.414 1.414L15 6.414V8a1 1 0 102 0V6.414l.293.293a1 1 0 101.414-1.414L17.414 4.586V3a1 1 0 00-1-1h-1zM2 10a1 1 0 011-1h1.586l1.293-1.293a1 1 0 111.414 1.414L6.414 10H8a1 1 0 110 2H6.414l-.293.293a1 1 0 11-1.414-1.414L5.414 11H3a1 1 0 01-1-1zm14 0a1 1 0 011-1h1.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10h1.586a1 1 0 110 2h-1.586l-.293.293a1 1 0 11-1.414-1.414L15.414 11h-1.586a1 1 0 01-1-1zM10 15a1 1 0 011-1h.586l1.293-1.293a1 1 0 111.414 1.414L13.414 15H15a1 1 0 110 2h-1.586l-.293.293a1 1 0 11-1.414-1.414L12.414 16H11a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  );

  const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-sky-400 tracking-tight">
            Learning Path
          </h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onHistoryClick}
              className="p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-sky-400 transition-colors"
              title="View Roadmap History"
              aria-label="View roadmap history"
            >
              <HistoryIcon />
            </button>
            <button
              onClick={onGenerateClick}
              className="p-2 rounded-full text-slate-300 hover:bg-slate-700 hover:text-sky-400 transition-colors"
              title="Generate New Path with AI"
              aria-label="Generate new learning path with AI"
            >
              <SparklesIcon />
            </button>
            <div className="flex items-center space-x-1">
              <span className="text-orange-400 font-bold text-lg">{streakCount}</span>
              <FlameIcon />
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full">
              <img src="https://picsum.photos/40/40" alt="User avatar" className="rounded-full"/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
