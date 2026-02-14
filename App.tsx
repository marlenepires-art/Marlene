
import React, { useState, useEffect, useCallback } from 'react';
import { GameStatus, GameState, Question, Difficulty } from './types';
import { GRAMMAR_TOPICS } from './constants';
import { generateQuestion, getTrophyMessage, generateTTS } from './services/geminiService';
import { audioService } from './services/audioService';
import QuizCard from './components/QuizCard';
import StartScreen from './components/StartScreen';
import LoadingSpinner from './components/LoadingSpinner';
import FeedbackScreen from './components/FeedbackScreen';
import EndScreen from './components/EndScreen';

const STORAGE_KEY = 'gramatica_magica_progress';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: null,
    score: 0,
    totalQuestions: 0,
    status: GameStatus.START,
    selectedDifficulty: 'fácil',
    hintUsed: false,
    history: []
  });

  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [endMessage, setEndMessage] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);
  
  // Estado para controlar a animação visual da transição
  const [viewClass, setViewClass] = useState<string>('animate-pop-in');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameState;
        if (parsed.totalQuestions < 10 && parsed.status !== GameStatus.FINISHED) {
          setHasSavedGame(true);
        }
      } catch (e) {
        console.error("Erro ao carregar progresso:", e);
      }
    }
    
    const muted = localStorage.getItem('gramatica_magica_muted') === 'true';
    setIsMuted(muted);
    audioService.setMuted(muted);
  }, []);

  useEffect(() => {
    if (gameState.status !== GameStatus.START) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
    if (gameState.status === GameStatus.FINISHED) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [gameState]);

  useEffect(() => {
    audioService.setMuted(isMuted);
    localStorage.setItem('gramatica_magica_muted', String(isMuted));
  }, [isMuted]);

  // Função utilitária para coordenar animações de saída e entrada
  const performTransition = (updateAction: () => void) => {
    setViewClass('animate-fade-out');
    setTimeout(() => {
      updateAction();
      setViewClass('animate-pop-in');
    }, 300);
  };

  const handleReadText = async (text: string) => {
    if (isMuted) return;
    const base64 = await generateTTS(text);
    if (base64) {
      audioService.playTTS(base64);
    }
  };

  const fetchNextQuestion = useCallback(async (difficultyOverride?: Difficulty) => {
    setGameState(prev => ({ ...prev, status: GameStatus.LOADING }));
    try {
      const randomTopic = GRAMMAR_TOPICS[Math.floor(Math.random() * GRAMMAR_TOPICS.length)];
      const difficulty = difficultyOverride || gameState.selectedDifficulty;
      const question = await generateQuestion(randomTopic, difficulty);
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: question,
        status: GameStatus.PLAYING
      }));
      
      handleReadText(`${question.question}. As opções são: ${question.options.join(', ')}`);
      
    } catch (error) {
      console.error("Erro ao carregar pergunta:", error);
      alert("Ups! Ocorreu um erro ao carregar o desafio. Tenta novamente.");
      setGameState(prev => ({ ...prev, status: GameStatus.START }));
    }
  }, [gameState.selectedDifficulty, isMuted]);

  const startGame = (difficulty: Difficulty) => {
    audioService.playClick();
    performTransition(() => {
      const newState: GameState = {
        currentQuestion: null,
        score: 0,
        totalQuestions: 0,
        status: GameStatus.LOADING,
        selectedDifficulty: difficulty,
        hintUsed: false,
        history: []
      };
      setGameState(newState);
      setHasSavedGame(false);
      fetchNextQuestion(difficulty);
    });
  };

  const continueGame = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      performTransition(() => {
        const parsed = JSON.parse(saved) as GameState;
        setGameState(parsed);
        setHasSavedGame(false);
        audioService.playClick();
        
        if (parsed.status === GameStatus.PLAYING && parsed.currentQuestion) {
          handleReadText(`${parsed.currentQuestion.question}. As opções são: ${parsed.currentQuestion.options.join(', ')}`);
        }
      });
    }
  };

  const handleAnswer = (index: number) => {
    if (!gameState.currentQuestion) return;

    performTransition(() => {
      const isCorrect = index === gameState.currentQuestion!.correctAnswerIndex;
      
      if (isCorrect) {
        audioService.playSuccess();
      } else {
        audioService.playFailure();
      }

      setLastAnswerCorrect(isCorrect);
      
      setGameState(prev => ({
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        totalQuestions: prev.totalQuestions + 1,
        status: GameStatus.FEEDBACK,
        history: [...prev.history, { question: prev.currentQuestion!.question, isCorrect }]
      }));

      const feedbackText = isCorrect ? "Boa! Estás correto!" : "Quase lá!";
      handleReadText(`${feedbackText}. ${gameState.currentQuestion!.explanation}`);
    });
  };

  const handleUseHint = () => {
    if (gameState.hintUsed) return;
    setGameState(prev => ({ ...prev, hintUsed: true }));
    audioService.playClick();
    if (gameState.currentQuestion) {
      handleReadText(`Aqui tens uma pista mágica: ${gameState.currentQuestion.hint}`);
    }
  };

  const proceed = async () => {
    audioService.playClick();
    audioService.stopTTS();
    
    performTransition(async () => {
      if (gameState.totalQuestions >= 10) {
        setGameState(prev => ({ ...prev, status: GameStatus.LOADING }));
        const msg = await getTrophyMessage(gameState.score, 10);
        setEndMessage(msg);
        setGameState(prev => ({ ...prev, status: GameStatus.FINISHED }));
        handleReadText(`Desafio concluído! Fizeste ${gameState.score} pontos. ${msg}`);
      } else {
        fetchNextQuestion();
      }
    });
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-1000 ${gameState.status === GameStatus.START ? '' : 'bg-gray-50/20'}`}>
      <div className="fixed top-6 left-0 right-0 flex justify-center px-4 z-50">
        <div className="glass px-6 py-2 rounded-full flex items-center space-x-4 shadow-xl border border-white/50">
          {gameState.status !== GameStatus.START && gameState.status !== GameStatus.FINISHED && (
            <>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⭐</span>
                <span className="font-bold text-indigo-900 whitespace-nowrap">{gameState.score} pontos</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <span className="text-gray-600 font-medium whitespace-nowrap">Questão {gameState.totalQuestions + (gameState.status === GameStatus.PLAYING ? 1 : 0)} de 10</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
            </>
          )}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-sm ${isMuted ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}
              title={isMuted ? "Ativar som" : "Desativar som"}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button 
              onClick={() => audioService.stopTTS()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm"
              title="Parar leitura"
            >
              🛑
            </button>
          </div>
        </div>
      </div>

      <main className={`w-full max-w-2xl z-10 ${viewClass}`}>
        {gameState.status === GameStatus.START && (
          <StartScreen 
            onStart={startGame} 
            onContinue={continueGame}
            hasSavedGame={hasSavedGame}
            onRead={() => handleReadText(hasSavedGame ? "Olá de novo! Queres continuar a tua aventura ou preferes começar um novo desafio?" : "Olá aventureiro! Escolhe um nível de dificuldade para começares a tua aventura gramatical!")} 
          />
        )}

        {gameState.status === GameStatus.LOADING && (
          <div className="glass p-12 rounded-[3rem] shadow-2xl">
            <LoadingSpinner />
          </div>
        )}

        {gameState.status === GameStatus.PLAYING && gameState.currentQuestion && (
          <QuizCard 
            question={gameState.currentQuestion} 
            onAnswer={handleAnswer} 
            hintUsedGlobal={gameState.hintUsed}
            onUseHint={handleUseHint}
          />
        )}

        {gameState.status === GameStatus.FEEDBACK && gameState.currentQuestion && (
          <FeedbackScreen 
            isCorrect={lastAnswerCorrect || false}
            explanation={gameState.currentQuestion.explanation}
            onContinue={proceed}
          />
        )}

        {gameState.status === GameStatus.FINISHED && (
          <EndScreen 
            score={gameState.score} 
            total={gameState.totalQuestions} 
            message={endMessage}
            onRestart={() => performTransition(() => setGameState({
              currentQuestion: null,
              score: 0,
              totalQuestions: 0,
              status: GameStatus.START,
              selectedDifficulty: 'fácil',
              hintUsed: false,
              history: []
            }))} 
          />
        )}
      </main>

      {gameState.status !== GameStatus.START && (
        <footer className="fixed bottom-4 text-white/70 text-sm font-medium italic drop-shadow-md">
          Narração mágica em Português de Portugal ativa! 🎙️
        </footer>
      )}
    </div>
  );
};

export default App;
