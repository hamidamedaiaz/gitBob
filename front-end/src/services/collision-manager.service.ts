import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Obstacle } from '../models/obstacle.model';

export interface CollisionEvent {
  type: 'rocket' | 'drag';
  sourceId: number;
  x: number;
  y: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class CollisionManager {
  private obstacles: Obstacle[] = [];
  private collisionSubject = new Subject<CollisionEvent>();
  private activeCollisionsSubject = new BehaviorSubject<Set<number>>(new Set());

  collision$ = this.collisionSubject.asObservable();
  activeCollisions$ = this.activeCollisionsSubject.asObservable();

  updateObstacles(obstacles: Obstacle[]): void {
    this.obstacles = obstacles;
  }

  checkRocketCollision(rocketX: number, rocketY: number, rocketWidth: number = 40, rocketHeight: number = 20): boolean {
    if (this.obstacles.length === 0) return false;

    const containerRect = this.getContainerDimensions();

    for (const obstacle of this.obstacles) {
      const obstacleRect = this.getObstacleRect(obstacle, containerRect);
      const rocketRect = {
        left: rocketX - rocketWidth / 2,
        right: rocketX + rocketWidth / 2,
        top: rocketY - rocketHeight / 2,
        bottom: rocketY + rocketHeight / 2
      };

      if (this.rectsIntersect(rocketRect, obstacleRect)) {
        this.emitCollision('rocket', 0, rocketX, rocketY);
        return true;
      }
    }
    return false;
  }

  checkDragCollision(dragX: number, dragY: number, dragWidth: number, dragHeight: number, sourceId: number): boolean {
    if (this.obstacles.length === 0) return false;

    const containerRect = this.getContainerDimensions();

    for (const obstacle of this.obstacles) {
      const obstacleRect = this.getObstacleRect(obstacle, containerRect);
      const dragRect = {
        left: dragX,
        right: dragX + dragWidth,
        top: dragY,
        bottom: dragY + dragHeight
      };

      if (this.rectsIntersect(dragRect, obstacleRect)) {
        this.emitCollision('drag', sourceId, dragX, dragY);
        return true;
      }
    }
    return false;
  }

  private getContainerDimensions() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  private getObstacleRect(obstacle: Obstacle, container: { width: number, height: number }) {
    return {
      left: (obstacle.x / 100) * container.width,
      right: ((obstacle.x + obstacle.width) / 100) * container.width,
      top: (obstacle.y / 100) * container.height,
      bottom: ((obstacle.y + obstacle.height) / 100) * container.height
    };
  }

  private rectsIntersect(rect1: any, rect2: any): boolean {
    return !(rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom);
  }

  private emitCollision(type: 'rocket' | 'drag', sourceId: number, x: number, y: number): void {
    const collision: CollisionEvent = {
      type,
      sourceId,
      x,
      y,
      timestamp: Date.now()
    };
    this.collisionSubject.next(collision);
  }

  addActiveCollision(id: number): void {
    const current = this.activeCollisionsSubject.value;
    current.add(id);
    this.activeCollisionsSubject.next(new Set(current));
  }

  removeActiveCollision(id: number): void {
    const current = this.activeCollisionsSubject.value;
    current.delete(id);
    this.activeCollisionsSubject.next(new Set(current));
  }

  clearAllCollisions(): void {
    this.activeCollisionsSubject.next(new Set());
  }
}
