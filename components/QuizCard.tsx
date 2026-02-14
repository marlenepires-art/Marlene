
import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuizCardProps {
  question: Question;
  onAnswer: (index: number) => void;
  hintUsedGlobal: boolean;
  onUseHint: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, onAnswer, hintUsedGlobal, onUseHint }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [localHintUsed, setLocalHintUsed] = useState(false);
  const [removedOptionIndex, setRemovedOptionIndex] = useState<number | null>(null);
  const [isSparkling, setIsSparkling] = useState(false);

  // Resetar estados locais quando a pergunta muda
  useEffect(() => {
    setLocalHintUsed(false);
    setRemovedOptionIndex(null);
    setIsSparkling(false);
  }, [question.id]);

  const handleChoice = (index: number) => {
    if (removedOptionIndex === index) return;
    setSelectedIndex(index);
    // Pequeno atraso para o utilizador ver a animação do botão selecionado
    setTimeout(() => {
      onAnswer(index);
      setSelectedIndex(null);
    }, 250);
  };

  const triggerHint = () => {
    if (hintUsedGlobal || localHintUsed) return;
    
    setIsSparkling(true);
    
    // Pequeno atraso para o efeito "mágico" antes de remover a opção
    setTimeout(() => {
      // Escolher uma opção incorreta aleatória para remover
      const incorrectIndices = question.options
        .map((_, i) => i)
        .filter(i => i !== question.correctAnswerIndex);
      
      const randomIndexToRemove = incorrectIndices[Math.floor(Math.random() * incorrectIndices.length)];
      
      setRemovedOptionIndex(randomIndexToRemove);
      setLocalHintUsed(true);
      onUseHint();
      setIsSparkling(false);
    }, 400);
  };

  return (
    <div className={`glass p-8 rounded-[2rem] shadow-2xl border-b-8 transition-all duration-500 animate-pop-in relative ${isSparkling ? 'ring-4 ring-amber-300 border-amber-300' : 'border-indigo-200'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {question.topic}
          </span>
          <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {question.difficulty}
          </span>
        </div>
        
        <button
          onClick={triggerHint}
          disabled={hintUsedGlobal || isSparkling}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-sm transition-all
            ${hintUsedGlobal 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' 
              : isSparkling
                ? 'bg-amber-400 text-white animate-pulse'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg hover:scale-105 active:scale-95'
            }
          `}
          title={hintUsedGlobal ? "Dica já utilizada neste jogo" : "Usar dica mágica (1 por jogo)"}
        >
          <span className={isSparkling ? 'animate-spin' : ''}>🪄</span>
          <span>{hintUsedGlobal ? "Dica Usada" : isSparkling ? "A conjurar..." : "Dica"}</span>
        </button>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-snug">
        {question.question}
      </h2>

      {localHintUsed && (
        <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl animate-slide-up animate-shimmer-glow relative overflow-hidden">
          {/* Efeito de brilho de fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"></div>
          <p className="text-amber-800 text-sm font-medium italic relative z-10">
            <span className="text-lg mr-2">💡</span>
            <strong>Pista Mágica:</strong> {question.hint}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => {
          const isRemoved = removedOptionIndex === index;
          const isSelected = selectedIndex === index;
          
          return (
            <button
              key={index}
              disabled={isRemoved || selectedIndex !== null}
              onClick={() => handleChoice(index)}
              className={`
                group relative flex items-center p-5 text-left transition-all duration-300 
                bg-white border-2 rounded-2xl
                ${isRemoved 
                  ? 'animate-magic-poof pointer-events-none' 
                  : isSelected 
                    ? 'border-indigo-600 bg-indigo-50 shadow-inner animate-click-pulse ring-2 ring-indigo-200' 
                    : 'border-gray-100 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-lg hover:-translate-y-1 active:scale-95'
                }
              `}
            >
              <div className={`
                flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors
                ${isRemoved
                  ? 'bg-gray-200 text-gray-400'
                  : isSelected 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-600 group-hover:text-white'
                }
              `}>
                {isRemoved ? '✨' : String.fromCharCode(65 + index)}
              </div>
              <span className={`
                ml-4 text-lg font-semibold transition-colors
                ${isRemoved ? 'text-gray-400 line-through' : isSelected ? 'text-indigo-900' : 'text-gray-700 group-hover:text-indigo-900'}
              `}>
                {option}
              </span>
              
              {isRemoved && (
                <span className="absolute right-4 text-xs font-black text-amber-600 uppercase tracking-tighter animate-pulse">Desvanecida!</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCard;
