
import React from 'react';

const Header: React.FC = () => {
  const FlameIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM10 2a1 1 0 011 1v3.268l1.83 5.49a1 1 0 11-1.83.614L10 8.268V3a1 1 0 011-1zm-1 11a1 1 0 00-1 1v.054l-1.622-4.867a1 1 0 10-1.898.632l2.25 6.75a1 1 0 00.946.685h3.352a1 1 0 00.946-.685l.75-2.25a1 1 0 10-1.898-.632L9 13.054V13z" clipRule="evenodd" />
    </svg>
  );

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-sky-400 tracking-tight">
            Learning Path
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-orange-400 font-bold text-lg">10</span>
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
