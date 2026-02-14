
import React, { useEffect } from 'react';
import { Difficulty } from '../types';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
  onContinue: () => void;
  hasSavedGame: boolean;
  onRead: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onContinue, hasSavedGame, onRead }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRead();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 text-6xl animate-float-slow opacity-40">✨</div>
      <div className="absolute top-40 right-20 text-5xl animate-float-fast opacity-30">📖</div>
      <div className="absolute bottom-20 left-20 text-7xl animate-float-fast opacity-20">✏️</div>
      <div className="absolute bottom-40 right-10 text-6xl animate-float-slow opacity-40">🌟</div>

      <div className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full text-center relative z-10 border-t-8 border-indigo-400">
        <div className="mb-6 inline-block">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <span className="text-6xl block animate-bounce">🧙‍♂️</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter leading-tight">
          <span className="block text-indigo-900">Gramática</span>
          <span className="block text-gradient">Mágica</span>
        </h1>

        <p className="text-lg text-gray-700 mb-8 font-medium leading-relaxed">
          {hasSavedGame 
            ? "Tens uma aventura a meio! Queres continuar ou começar de novo?" 
            : "Escolhe o teu nível de desafio e domina a língua portuguesa! 🚀"}
        </p>

        {hasSavedGame && (
          <button
            onClick={onContinue}
            className="w-full mb-8 group relative inline-flex items-center justify-center px-8 py-5 font-black text-xl text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transform hover:-translate-y-1 active:scale-95 shadow-xl animate-pulse-subtle"
          >
            Continuar Aventura 🛡️
          </button>
        )}

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="px-4 bg-white/50 text-gray-500 font-bold">
              {hasSavedGame ? "Ou começa um Novo Desafio" : "Escolhe a Dificuldade"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => onStart('fácil')}
            className="group relative flex flex-col items-center justify-center p-6 bg-emerald-50 border-2 border-emerald-100 rounded-3xl transition-all duration-300 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-2 active:scale-95"
          >
            <span className="text-4xl mb-2 group-hover:animate-bounce">🌱</span>
            <span className="text-emerald-700 font-black text-xl">Fácil</span>
            <span className="text-emerald-600 text-xs mt-1 font-medium italic">Explorador</span>
          </button>

          <button
            onClick={() => onStart('médio')}
            className="group relative flex flex-col items-center justify-center p-6 bg-amber-50 border-2 border-amber-100 rounded-3xl transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:-translate-y-2 active:scale-95"
          >
            <span className="text-4xl mb-2 group-hover:animate-bounce">⚔️</span>
            <span className="text-amber-700 font-black text-xl">Médio</span>
            <span className="text-amber-600 text-xs mt-1 font-medium italic">Guerreiro</span>
          </button>

          <button
            onClick={() => onStart('difícil')}
            className="group relative flex flex-col items-center justify-center p-6 bg-rose-50 border-2 border-rose-100 rounded-3xl transition-all duration-300 hover:border-rose-400 hover:shadow-xl hover:-translate-y-2 active:scale-95"
          >
            <span className="text-4xl mb-2 group-hover:animate-bounce">🔥</span>
            <span className="text-rose-700 font-black text-xl">Difícil</span>
            <span className="text-rose-600 text-xs mt-1 font-medium italic">Lendário</span>
          </button>
        </div>
        
        <div className="flex justify-center space-x-8 pt-4 border-t border-gray-100">
          <div className="flex flex-col items-center opacity-60">
            <span className="text-2xl mb-1">🧠</span>
            <span className="text-[10px] font-black text-indigo-900 uppercase">Aprende</span>
          </div>
          <div className="flex flex-col items-center opacity-60">
            <span className="text-2xl mb-1">⚡</span>
            <span className="text-[10px] font-black text-indigo-900 uppercase">Desafia</span>
          </div>
          <div className="flex flex-col items-center opacity-60">
            <span className="text-2xl mb-1">💎</span>
            <span className="text-[10px] font-black text-indigo-900 uppercase">Vence</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
