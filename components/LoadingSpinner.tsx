import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Chargement..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-indigo-600">
      <Loader2 className="w-12 h-12 animate-spin mb-4" />
      <p className="text-lg font-medium text-slate-600 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;