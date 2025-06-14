import { ElementRef, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SourceImageData } from '../app/Game/source-image/source-image.component';
import { SoundService } from './sound.service';
import { ObstacleService } from "./obstacle.service";

export interface RocketState {
  active: boolean;
  sourceId: number;
  sourceElement: ElementRef | null;
  x: number;
  y: number;
  angle: number;
  targetId?: number;
  animating: boolean;
  returning: boolean;
}

export interface RocketLandingEvent {
  sourceId: number;
  targetId: number;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RocketService {
  private rocketStateSubject = new BehaviorSubject<RocketState>({
    active: false,
    sourceId: 0,
    sourceElement: null,
    x: 0,
    y: 0,
    angle: 0,
    animating: false,
    returning: false
  });

  rocketState$ = this.rocketStateSubject.asObservable();
  private rocketLandingSubject = new Subject<RocketLandingEvent>();
  rocketLanding$ = this.rocketLandingSubject.asObservable();

  private sourcePosition = { x: 0, y: 0 };
  private animationInProgress = false;
  private obstaclesEnabled = false;
  private collisionSubscription: any;

  constructor(
    private soundService: SoundService,
    private ngZone: NgZone,
    private obstacleService: ObstacleService
  ) {
    this.collisionSubscription = this.obstacleService.rocketCollision$.subscribe(collision => {
      console.log('Rocket collision event received:', collision);
      console.log('Rocket active:', this.isRocketActive());
      console.log('Animation in progress:', this.animationInProgress);

      if (collision && this.isRocketActive() && !this.animationInProgress) {
        console.log('Processing collision - returning rocket');
        this.handleObstacleCollision();
      }
    });
  }

  destroy(): void {
    if (this.collisionSubscription) {
      this.collisionSubscription.unsubscribe();
    }
  }

  setObstaclesEnabled(enabled: boolean): void {
    this.obstaclesEnabled = enabled;
  }

  private collisionStartTime = 0;
  private collisionDelay = 500;

  launchRocket(sourceData: SourceImageData, element: ElementRef, x: number, y: number): void {
    const currentState = this.rocketStateSubject.getValue();

    if (currentState.active || this.animationInProgress) {
      return;
    }

    const rect = element.nativeElement.getBoundingClientRect();
    this.sourcePosition = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    this.collisionStartTime = Date.now();
    this.soundService.playDragSound();

    this.rocketStateSubject.next({
      active: true,
      sourceId: sourceData.id,
      sourceElement: element,
      x: x || this.sourcePosition.x,
      y: y || this.sourcePosition.y,
      angle: 0,
      animating: false,
      returning: false
    });
  }

  updateRocketPosition(x: number, y: number): void {
    const currentState = this.rocketStateSubject.getValue();

    if (!currentState.active || currentState.animating) {
      return;
    }

    const dx = x - currentState.x;
    const dy = y - currentState.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    this.rocketStateSubject.next({
      ...currentState,
      x,
      y,
      angle
    });

    if (this.obstaclesEnabled && (Date.now() - this.collisionStartTime) > this.collisionDelay) {
      this.obstacleService.setRocketPosition(x, y);
    }
  }



  handleObstacleCollision(): void {
    const currentState = this.rocketStateSubject.getValue();

    if (!currentState.active || this.animationInProgress) {
      return;
    }

    console.log('Handling obstacle collision - returning rocket');
    this.animationInProgress = true;
    this.soundService.playFailureSound();
    this.returnRocketToSource();
  }

  canLaunchRocket(): boolean {
    const state = this.rocketStateSubject.getValue();
    return !state.active && !this.animationInProgress;
  }

  resetRocket(): void {
    this.animationInProgress = false;
    this.obstacleService.resetCollisionState();

    this.rocketStateSubject.next({
      active: false,
      sourceId: 0,
      sourceElement: null,
      x: 0,
      y: 0,
      angle: 0,
      animating: false,
      returning: false
    });
  }

  returnRocketToSource(): void {
    const currentState = this.rocketStateSubject.getValue();
    if (!currentState.active || currentState.animating) return;

    this.rocketStateSubject.next({
      ...currentState,
      returning: true,
      animating: true
    });

    this.animateReturnWithArc(currentState.x, currentState.y, this.sourcePosition.x, this.sourcePosition.y, 800);
  }

  landRocket(targetId: number, isCorrectTarget: boolean): void {
    const currentState = this.rocketStateSubject.getValue();
    if (!currentState.active || currentState.animating || this.animationInProgress) return;

    this.animationInProgress = true;

    this.rocketLandingSubject.next({
      sourceId: currentState.sourceId,
      targetId,
      success: isCorrectTarget
    });

    const landingState = {
      ...currentState,
      targetId,
      animating: true,
      angle: 15
    };

    this.rocketStateSubject.next(landingState);

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.resetRocket();
          this.animationInProgress = false;
        });
      }, 1000);
    });
  }

  isRocketActive(): boolean {
    return this.rocketStateSubject.getValue().active;
  }

  getCurrentSourceId(): number | null {
    const state = this.rocketStateSubject.getValue();
    return state.active ? state.sourceId : null;
  }

  getCurrentState(): RocketState {
    return this.rocketStateSubject.getValue();
  }

  getRocketPosition(): { x: number, y: number } {
    const state = this.rocketStateSubject.getValue();
    return { x: state.x, y: state.y };
  }

  private animateReturnWithArc(startX: number, startY: number, endX: number, endY: number, duration: number): void {
    const startTime = performance.now();
    const controlX = (startX + endX) / 2;
    const controlY = Math.min(startY, endY) - 80;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const t = easeProgress;
      const oneMinusT = 1 - t;

      const x = oneMinusT * oneMinusT * startX + 2 * oneMinusT * t * controlX + t * t * endX;
      const y = oneMinusT * oneMinusT * startY + 2 * oneMinusT * t * controlY + t * t * endY;

      const tangentX = 2 * (1 - t) * (controlX - startX) + 2 * t * (endX - controlX);
      const tangentY = 2 * (1 - t) * (controlY - startY) + 2 * t * (endY - controlY);
      const angle = Math.atan2(tangentY, tangentX) * 180 / Math.PI;

      const currentState = this.rocketStateSubject.getValue();
      this.rocketStateSubject.next({
        ...currentState,
        x,
        y,
        angle
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.ngZone.run(() => {
          this.resetRocket();
          this.animationInProgress = false;
        });
      }
    };

    requestAnimationFrame(animate);
  }
}
