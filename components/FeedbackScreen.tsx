
import React from 'react';

interface FeedbackScreenProps {
  isCorrect: boolean;
  explanation: string;
  onContinue: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ isCorrect, explanation, onContinue }) => {
  return (
    <div className={`
      glass p-8 rounded-[2rem] shadow-2xl text-center border-b-8 animate-pop-in
      ${isCorrect ? 'border-emerald-200' : 'border-rose-200'}
    `}>
      <div className={`
        w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full text-5xl shadow-inner
        ${isCorrect ? 'bg-emerald-100 animate-wobble' : 'bg-rose-100 animate-shake'}
      `}>
        {isCorrect ? '✨' : '🧐'}
      </div>
      
      <h2 className={`text-3xl font-black mb-4 animate-slide-up ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isCorrect ? 'Boa! Estás correto!' : 'Quase lá! Vamos aprender?'}
      </h2>

      <div className="bg-white/50 p-6 rounded-2xl mb-8 border border-white shadow-sm overflow-hidden relative animate-slide-up [animation-delay:200ms]">
        {/* Decorative background element for the explanation box */}
        <div className={`absolute top-0 left-0 w-1 h-full ${isCorrect ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
        <p className="text-lg text-gray-700 italic leading-relaxed text-left pl-2">
          {explanation}
        </p>
      </div>

      <button
        onClick={onContinue}
        className={`
          w-full py-4 rounded-2xl font-bold text-white transition-all transform active:scale-95 shadow-lg 
          animate-pulse-subtle animate-slide-up [animation-delay:400ms]
          ${isCorrect ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'}
        `}
      >
        Continuar Viagem 🚀
      </button>
    </div>
  );
};

export default FeedbackScreen;
