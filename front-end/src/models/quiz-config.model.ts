export interface QuizConfig {
  taillePolice: number;
  tailleImage: number;
  luminosite: number;
  feedbackSucces: string;
  feedbackEchec: string;
  typeIndice: boolean;
  chronometre: boolean;
  ordreAleatoire: boolean;
  background: {
    type: 'color' | 'image' | 'video';
    value: string;
  };

  hint: {
    text?: string;
    image?: File | null;
    audio?: File | null;
    video?: File | null;
  };
}
