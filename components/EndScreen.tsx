
import React from 'react';

interface EndScreenProps {
  score: number;
  total: number;
  message: string;
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, total, message, onRestart }) => {
  const percentage = (score / total) * 100;

  const getEncouragement = () => {
    if (percentage >= 90) return { 
      title: "Fantástico! ✨", 
      subtitle: "És um génio da gramática!", 
      icon: "👑",
      color: "text-amber-500" 
    };
    if (percentage >= 75) return { 
      title: "Excelente! 🌟", 
      subtitle: "O teu conhecimento é brilhante!", 
      icon: "💎",
      color: "text-indigo-600" 
    };
    if (percentage >= 50) return { 
      title: "Muito Bem! 💪", 
      subtitle: "Estás no bom caminho para a mestria!", 
      icon: "🚀",
      color: "text-emerald-600" 
    };
    return { 
      title: "Bom Esforço! 📚", 
      subtitle: "Cada erro é uma oportunidade para aprenderes mais!", 
      icon: "🌱",
      color: "text-rose-500" 
    };
  };

  const encouragement = getEncouragement();
  
  return (
    <div className="text-center glass p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden animate-pop-in border-t-8 border-indigo-500">
      {/* Elementos Decorativos de Celebração */}
      <div className="absolute top-10 left-10 text-4xl animate-float-slow opacity-30">🎈</div>
      <div className="absolute top-20 right-10 text-4xl animate-float-fast opacity-30">🎉</div>
      <div className="absolute bottom-10 right-20 text-4xl animate-float-slow opacity-30">✨</div>
      <div className="absolute bottom-20 left-10 text-4xl animate-float-fast opacity-30">🎊</div>

      <div className="relative z-10">
        <div className="mb-2 text-6xl">{encouragement.icon}</div>
        <h1 className={`text-4xl md:text-5xl font-black mb-2 ${encouragement.color}`}>
          {encouragement.title}
        </h1>
        <p className="text-xl md:text-2xl font-bold text-gray-700 mb-8 italic">
          "{encouragement.subtitle}"
        </p>
        
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="relative inline-block">
            {/* Círculo de Progressão */}
            <svg className="w-48 h-48 md:w-56 md:h-56 transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-100"
              />
              <circle
                cx="50%"
                cy="50%"
                r="42%"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="100 100"
                strokeDashoffset={100 - percentage}
                strokeLinecap="round"
                style={{ strokeDasharray: '264', strokeDashoffset: 264 - (264 * percentage) / 100 }}
                className={`${encouragement.color} transition-all duration-1000 ease-out`}
              />
            </svg>
            
            {/* Pontuação Central */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="block text-5xl md:text-6xl font-black text-indigo-900 leading-none">
                {score}
              </span>
              <span className="block text-lg md:text-xl font-bold text-gray-400 uppercase tracking-widest mt-1">
                de {total}
              </span>
            </div>
          </div>
          
          <div className="mt-6 px-6 py-2 bg-indigo-50 rounded-full border border-indigo-100">
            <span className="text-indigo-700 font-black text-lg">
              Precisão de {Math.round(percentage)}%
            </span>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl mb-10 border border-white/60 shadow-inner">
          <p className="text-gray-600 font-medium leading-relaxed italic">
            {message}
          </p>
        </div>

        <button
          onClick={onRestart}
          className="group relative w-full md:w-auto px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black text-xl rounded-2xl transition-all shadow-xl hover:shadow-indigo-300 hover:-translate-y-1 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center">
            Jogar Novamente <span className="ml-3 group-hover:rotate-180 transition-transform duration-500">🔄</span>
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
};

export default EndScreen;
