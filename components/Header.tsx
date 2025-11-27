import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-200 transition-colors">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500">
            RéviCollège
          </span>
        </button>
        <div className="text-sm font-medium text-slate-500 hidden sm:block">
          Programme Officiel 2024-2025
        </div>
      </div>
    </header>
  );
};

export default Header;