import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-blue-600 animate-spin" />
      <span className="text-sm md:text-base text-gray-500 font-medium">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {content}
    </div>
  );
};

export default Loader;
