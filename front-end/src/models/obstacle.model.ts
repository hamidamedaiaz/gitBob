export interface Obstacle {
  id: number;
  x: number;
  y: number;    // Y position (percentage of container height)
  width: number;  // Width (percentage of container width)
  height: number; // Height (percentage of container height)
  type: 'static' | 'moving'; // Static or moving obstacle
  movementPattern?: 'vertical' | 'horizontal' | 'circular'; // For moving obstacles
  speed?: number; // Units per second
  direction?: number; // 1 for down/right, -1 for up/left
  minY?: number; // Minimum Y position (for vertical movement)
  maxY?: number; // Maximum Y position (for vertical movement)
  minX?: number; // Minimum X position (for horizontal movement)
  maxX?: number; // Maximum X position (for horizontal movement)
  imageUrl?: string; // Optional image for the obstacle
  color?: string;    // Background color for the obstacle

  // Allow for dynamic properties with index signature
  [key: string]: any;
}

export interface DifficultyLevel {
  id: string;  // 'easy', 'medium', 'hard'
  name: string;
  description: string;
  obstacleCount: number;
  obstacles: Obstacle[];
}
