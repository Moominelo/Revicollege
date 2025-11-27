
import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-lg group-hover:bg-indigo-200 transition-colors">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500 tracking-tight">
            RéviCollège
          </span>
        </button>
        <div className="text-[10px] sm:text-sm font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
          Programme 2024-2025
        </div>
      </div>
    </header>
  );
};

export default Header;
