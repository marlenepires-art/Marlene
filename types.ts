
export type Difficulty = 'fácil' | 'médio' | 'difícil';

export interface Question {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  difficulty: Difficulty;
}

export enum GameStatus {
  START = 'START',
  PLAYING = 'PLAYING',
  LOADING = 'LOADING',
  FEEDBACK = 'FEEDBACK',
  FINISHED = 'FINISHED'
}

export interface GameState {
  currentQuestion: Question | null;
  score: number;
  totalQuestions: number;
  status: GameStatus;
  selectedDifficulty: Difficulty;
  hintUsed: boolean;
  history: {
    question: string;
    isCorrect: boolean;
  }[];
}
