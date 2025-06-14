export interface GameDisplayConfig {
  fontSize: number;
  imageSize: number;
  brightness: number;
  background: {
    type: 'color' | 'image' | 'video';
    value: string;
  };
  feedback: {
    success: string;
    failure: string;
  };
  randomMode: boolean;
  soundEnabled?: boolean;
  difficulty: 'easy' | 'medium' | 'hard'; // New difficulty setting
  obstaclesEnabled: boolean;   // Toggle for enabling/disabling obstacles
}
