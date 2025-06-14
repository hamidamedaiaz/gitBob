export interface SourceImage {
  id: number;
  src: string;
  alt: string;
  pair: number;
}

export interface TargetImage {
  id: number;
  src: string;
  alt: string;
  label: string;
  pair: number;
}

export interface GameProgress {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  hintUsed: boolean;
  completedPairs: number[];
}

export interface GameSession {
  id: string;
  userId: string;
  sourceImages: SourceImage[];
  targetImages: TargetImage[];
  startTime: Date;
  endTime?: Date;
  duration?: number;
  score: number;
  hintsUsed: number;
}
