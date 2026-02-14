
import React, { useState, useEffect } from 'react';

const LoadingSpinner: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const tips = [
    "A preparar o próximo desafio...",
    "A afiar os lápis gramaticais...",
    "A consultar o dicionário mágico...",
    "Quase pronto para o próximo nível!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
          ✍️
        </div>
      </div>
      <p className="text-xl font-bold text-indigo-900 animate-pulse">
        {tips[tipIndex]}
      </p>
    </div>
  );
};

export default LoadingSpinner;
