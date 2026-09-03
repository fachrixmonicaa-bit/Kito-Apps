import React from 'react';
import { Settings, Clock } from 'lucide-react';

const PlaceholderPage = ({ title, phase }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
        <Clock size={48} />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 max-w-md">
        Halaman ini sedang dalam tahap pengembangan sesuai dengan rancangan PRD (Fase {phase}).
      </p>
    </div>
  );
};

export default PlaceholderPage;
