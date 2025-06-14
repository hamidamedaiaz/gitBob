import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DifficultyLevel, Obstacle} from '../models/obstacle.model';

@Injectable({
  providedIn: 'root'
})
export class ObstacleService {
  // Array of obstacle image URLs
  private obstacleImages = [
    "assets/obstacle.png",
    "assets/obstacle.png",
    "assets/obstacle.png",
    "assets/obstacle1.png",
    "assets/obstacle1.png",
    "assets/obstacle1.png"
  ];

  // Fallback to a default obstacle image if specific images aren't available
  private defaultObstacleImage = "assets/obstacles/default-obstacle.png";

  // A palette of nice colors for color variations (used with CSS filters)
  private obstacleColors = [
    "#FF5722", // Deep Orange
    "#FF9800", // Orange
    "#FFC107", // Amber
    "#FFEB3B", // Yellow
    "#8BC34A", // Light Green
    "#4CAF50"  // Green
  ];

  // Updated difficulty levels with image URLs
  private difficultyLevels: DifficultyLevel[] = [
    {
      id: 'easy',
      name: 'Facile',
      description: 'Trois obstacles statiques',
      obstacleCount: 3,
      obstacles: this.createEasyModeObstacles()
    },
    {
      id: 'medium',
      name: 'Moyen',
      description: 'Six obstacles statiques en deux colonnes',
      obstacleCount: 6,
      obstacles: this.createMediumModeObstacles()
    },
    {
      id: 'hard',
      name: 'Difficile',
      description: 'Six obstacles avec mouvements verticaux alternés',
      obstacleCount: 6,
      obstacles: this.createHardModeObstacles()
    }
  ];

  private currentDifficultySubject = new BehaviorSubject<DifficultyLevel>(this.difficultyLevels[0]);
  currentDifficulty$ = this.currentDifficultySubject.asObservable();

  private activeObstaclesSubject = new BehaviorSubject<Obstacle[]>([]);
  activeObstacles$ = this.activeObstaclesSubject.asObservable();

  private collisionDetectedSubject = new BehaviorSubject<boolean>(false);
  collisionDetected$ = this.collisionDetectedSubject.asObservable();

  private rocketCollisionSubject = new BehaviorSubject<boolean>(false);
  rocketCollision$ = this.rocketCollisionSubject.asObservable();

  private rocketPositionSubject = new BehaviorSubject<{x: number, y: number} | null>(null);

  constructor() {
    // Initialize with easy difficulty obstacles
    this.setDifficulty('easy');
  }

  setRocketPosition(x: number, y: number): void {
    this.rocketPositionSubject.next({x, y});
    this.checkRocketCollision(x, y);
  }

  private isCollisionActive = false;

  private checkRocketCollision(rocketX: number, rocketY: number): void {
    if (this.isCollisionActive) {
      return;
    }

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const rocketWidth = 60;
    const rocketHeight = 30;

    for (const obstacle of this.activeObstaclesSubject.value) {
      const obstacleLeft = (obstacle.x / 100) * containerWidth;
      const obstacleRight = ((obstacle.x + obstacle.width) / 100) * containerWidth;
      const obstacleTop = (obstacle.y / 100) * containerHeight;
      const obstacleBottom = ((obstacle.y + obstacle.height) / 100) * containerHeight;

      const rocketLeft = rocketX - rocketWidth / 2;
      const rocketRight = rocketX + rocketWidth / 2;
      const rocketTop = rocketY - rocketHeight / 2;
      const rocketBottom = rocketY + rocketHeight / 2;

      if (rocketRight >= obstacleLeft &&
        rocketLeft <= obstacleRight &&
        rocketBottom >= obstacleTop &&
        rocketTop <= obstacleBottom) {

        console.log('COLLISION DETECTED!');
        this.isCollisionActive = true;
        this.rocketCollisionSubject.next(true);

        setTimeout(() => {
          this.isCollisionActive = false;
          this.rocketCollisionSubject.next(false);
        }, 2000);

        return;
      }
    }
  }

  getDifficultyLevels(): DifficultyLevel[] {
    return [...this.difficultyLevels];
  }

  setDifficulty(difficultyId: 'easy' | 'medium' | 'hard'): void {
    const difficulty = this.difficultyLevels.find(d => d.id === difficultyId);

    if (difficulty) {
      this.currentDifficultySubject.next(difficulty);

      // Make a deep copy of obstacles to avoid referencing the original objects
      const obstaclesCopy = difficulty.obstacles.map(obstacle => {
        return {...obstacle};
      });

      this.activeObstaclesSubject.next(obstaclesCopy);
      console.log(`Difficulty set to ${difficultyId} with ${obstaclesCopy.length} obstacles`);
    } else {
      console.warn(`Difficulty level ${difficultyId} not found, defaulting to easy`);
      const easyDifficulty = this.difficultyLevels[0];
      this.currentDifficultySubject.next(easyDifficulty);
      this.activeObstaclesSubject.next([...easyDifficulty.obstacles]);
    }
  }

  getCurrentDifficulty(): DifficultyLevel {
    return this.currentDifficultySubject.value;
  }

  getActiveObstacles(): Obstacle[] {
    return this.activeObstaclesSubject.value;
  }

  detectCollision(dragX: number, dragY: number, dragWidth: number, dragHeight: number): boolean {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const dragXPx = dragX;
    const dragYPx = dragY;
    const dragWidthPx = dragWidth;
    const dragHeightPx = dragHeight;

    const obstacles = this.activeObstaclesSubject.value;

    for (const obstacle of obstacles) {
      const obstacleXPx = (obstacle.x / 100) * containerWidth;
      const obstacleYPx = (obstacle.y / 100) * containerHeight;
      const obstacleWidthPx = (obstacle.width / 100) * containerWidth;
      const obstacleHeightPx = (obstacle.height / 100) * containerHeight;

      const collision = !(
        dragXPx + dragWidthPx < obstacleXPx ||
        dragXPx > obstacleXPx + obstacleWidthPx ||
        dragYPx + dragHeightPx < obstacleYPx ||
        dragYPx > obstacleYPx + obstacleHeightPx
      );

      if (collision) {
        console.log('Drag collision detected!', {
          dragPos: {x: dragXPx, y: dragYPx, w: dragWidthPx, h: dragHeightPx},
          obstaclePos: {x: obstacleXPx, y: obstacleYPx, w: obstacleWidthPx, h: obstacleHeightPx}
        });

        this.collisionDetectedSubject.next(true);
        setTimeout(() => this.collisionDetectedSubject.next(false), 500);
        return true;
      }
    }

    return false;
  }

  resetCollision(): void {
    this.collisionDetectedSubject.next(false);
  }

  resetCollisionState(): void {
    console.log('Resetting collision state');
    this.isCollisionActive = false;
    this.rocketCollisionSubject.next(false);
  }

  updateMovingObstacles(deltaTime: number): void {
    const obstacles = this.activeObstaclesSubject.value;

    // Create a completely new array to ensure change detection
    const updatedObstacles = obstacles.map(obstacle => {
      // Create a new obstacle object (don't mutate the original)
      const newObstacle = { ...obstacle };

      if (obstacle.type === 'moving') {
        if (obstacle.movementPattern === 'vertical') {
          const minY = obstacle.minY ?? 10;
          const maxY = obstacle.maxY ?? 90;

          // Initialize direction if not set
          if (newObstacle.direction === undefined) {
            newObstacle.direction = 1;
          }

          const speed = obstacle.speed ?? 15;
          newObstacle.y += speed * newObstacle.direction * deltaTime;

          // Boundary check and direction reversal
          if (newObstacle.y <= minY || newObstacle.y >= maxY) {
            newObstacle.direction *= -1;
            // Clamp to boundaries to prevent overshooting
            newObstacle.y = Math.max(minY, Math.min(maxY, newObstacle.y));
          }

        } else if (obstacle.movementPattern === 'horizontal') {
          const minX = obstacle.minX ?? 20;
          const maxX = obstacle.maxX ?? 80;

          // Initialize direction if not set
          if (newObstacle.direction === undefined) {
            newObstacle.direction = 1;
          }

          const speed = obstacle.speed ?? 15;
          newObstacle.x += speed * newObstacle.direction * deltaTime;

          // Boundary check and direction reversal
          if (newObstacle.x <= minX || newObstacle.x >= maxX) {
            newObstacle.direction *= -1;
            // Clamp to boundaries to prevent overshooting
            newObstacle.x = Math.max(minX, Math.min(maxX, newObstacle.x));
          }
        }
      }

      return newObstacle;
    });

    // CRITICAL: Always emit a new array reference to trigger change detection
    this.activeObstaclesSubject.next(updatedObstacles);
  }

  // Helper method to get image URL for obstacle
  private getObstacleImageUrl(index: number): string {
    return this.obstacleImages[index % this.obstacleImages.length] || this.defaultObstacleImage;
  }



  // Create obstacles for easy mode - 3 obstacles in center
  private createEasyModeObstacles(): Obstacle[] {
    return [
      {
        id: 1,
        x: 45,
        y: 25,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(0),
        color: this.obstacleColors[0]
      },
      {
        id: 2,
        x: 45,
        y: 50,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(1),
        color: this.obstacleColors[1]
      },
      {
        id: 3,
        x: 45,
        y: 75,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(2),
        color: this.obstacleColors[2]
      }
    ];
  }

  // Create obstacles for medium mode - 6 obstacles in 2 columns
  private createMediumModeObstacles(): Obstacle[] {
    return [
      // Left column
      {
        id: 1,
        x: 35,
        y: 25,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(0),
        color: this.obstacleColors[0]
      },
      {
        id: 2,
        x: 35,
        y: 50,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(1),
        color: this.obstacleColors[1]
      },
      {
        id: 3,
        x: 35,
        y: 75,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(2),
        color: this.obstacleColors[2]
      },

      // Right column
      {
        id: 4,
        x: 55,
        y: 25,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(3),
        color: this.obstacleColors[3]
      },
      {
        id: 5,
        x: 55,
        y: 50,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(4),
        color: this.obstacleColors[4]
      },
      {
        id: 6,
        x: 55,
        y: 75,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(5),
        color: this.obstacleColors[5]
      }
    ];
  }

  // Create obstacles for hard mode - 6 obstacles in 2 columns with vertical movement pattern
  private createHardModeObstacles(): Obstacle[] {
    return [
      // Left column - vertical, static, vertical
      {
        id: 1,
        x: 35,
        y: 25,
        width: 10,
        height: 10,
        type: 'moving',
        movementPattern: 'vertical',
        speed: 20,
        direction: 1,
        minY: 15,
        maxY: 35,
        imageUrl: this.getObstacleImageUrl(0),
        color: this.obstacleColors[0]
      },
      {
        id: 2,
        x: 35,
        y: 50,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(1),
        color: this.obstacleColors[1]
      },
      {
        id: 3,
        x: 35,
        y: 75,
        width: 10,
        height: 10,
        type: 'moving',
        movementPattern: 'vertical',
        speed: 25,
        direction: -1,
        minY: 65,
        maxY: 85,
        imageUrl: this.getObstacleImageUrl(2),
        color: this.obstacleColors[2]
      },

      // Right column - vertical, static, vertical
      {
        id: 4,
        x: 55,
        y: 25,
        width: 10,
        height: 10,
        type: 'moving',
        movementPattern: 'vertical',
        speed: 18,
        direction: -1,
        minY: 15,
        maxY: 35,
        imageUrl: this.getObstacleImageUrl(3),
        color: this.obstacleColors[3]
      },
      {
        id: 5,
        x: 55,
        y: 50,
        width: 10,
        height: 10,
        type: 'static',
        imageUrl: this.getObstacleImageUrl(4),
        color: this.obstacleColors[4]
      },
      {
        id: 6,
        x: 55,
        y: 75,
        width: 10,
        height: 10,
        type: 'moving',
        movementPattern: 'vertical',
        speed: 22,
        direction: 1,
        minY: 65,
        maxY: 85,
        imageUrl: this.getObstacleImageUrl(5),
        color: this.obstacleColors[5]
      }
    ];
  }
}
