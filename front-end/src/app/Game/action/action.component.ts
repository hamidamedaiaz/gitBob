import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subscription, throttleTime } from 'rxjs';
import { GameService, GameState } from '../../../services/game.service';
import { GameDisplayService } from '../../../services/game-display.service';
import { SoundService } from '../../../services/sound.service';
import { GameDisplayConfig } from '../../../models/game-display-config.model';
import { SourceImageData } from '../source-image/source-image.component';
import { TargetImageData } from '../target-image/target-image.component';
import { Router } from '@angular/router';
import { DOCUMENT } from "@angular/common";
import { Obstacle } from "../../../models/obstacle.model";
import { ObstacleService } from "../../../services/obstacle.service";
import { RocketService } from "../../../services/rocket.service";
import { CollisionManager } from "../../../services/collision-manager.service";

interface SourceGameElement {
  type: 'source';
  data: SourceImageData;
}

interface TargetGameElement {
  type: 'target';
  data: TargetImageData;
}

type GameElement = SourceGameElement | TargetGameElement;

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionComponent implements OnInit, OnDestroy {
  gameState$: Observable<GameState>;
  sourceImages$: BehaviorSubject<SourceImageData[]> = new BehaviorSubject<SourceImageData[]>([]);
  targetImages$: BehaviorSubject<TargetImageData[]> = new BehaviorSubject<TargetImageData[]>([]);
  leftColumnItems$: BehaviorSubject<GameElement[]> = new BehaviorSubject<GameElement[]>([]);
  rightColumnItems$: BehaviorSubject<GameElement[]> = new BehaviorSubject<GameElement[]>([]);
  showHint: boolean = false;
  feedbackState: 'default' | 'success' | 'failure' = 'default';
  showConfigModal: boolean = false;
  successMessage: string = '';
  failureMessage: string = '';
  backgroundImageUrl: string | null = null;
  backgroundColorValue: string | null = null;
  containerStyle: any = {};
  currentLevel: number = 1;
  obstacles: Obstacle[] = [];
  obstaclesEnabled: boolean = false;
  collisionDetected: boolean = false;
  animationFrameId: number | null = null;
  isGameCompleted: boolean = false;
  finalScore: number = 0;
  private mouseMoveSub: Subscription | null = null;
  private subscriptions: Subscription[] = [];
  private mouseUpSub: Subscription | null = null;

  constructor(
    private gameService: GameService,
    private gameDisplayService: GameDisplayService,
    private soundService: SoundService,
    private obstacleService: ObstacleService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private router: Router,
    private ngZone: NgZone,
    private rocketService: RocketService,
    private collisionManager: CollisionManager,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.gameState$ = this.gameService.gameState$;

    const quizSub = this.gameService.selectedQuiz$.subscribe(quiz => {
      if (quiz) {
        this.gameService.loadCurrentQuestion();
      }
    });
    this.subscriptions.push(quizSub);

    const stateSub = this.gameState$.subscribe(state => {
      if (this.currentLevel !== state.currentLevel) {
        this.currentLevel = state.currentLevel;
        this.loadLevelData(this.currentLevel);
      }

      if (state.displayConfig) {
        this.applyDisplayConfig(state.displayConfig);
      }

      if (state.displayConfig?.feedback) {
        this.successMessage = state.displayConfig.feedback.success || 'Great job!';
        this.failureMessage = state.displayConfig.feedback.failure || 'Try again!';
      }

      this.cdr.markForCheck();
    });
    this.subscriptions.push(stateSub);

    const configSub = this.gameDisplayService.getConfig().subscribe(config => {
      this.applyDisplayConfig(config);
      this.cdr.markForCheck();
    });
    this.subscriptions.push(configSub);

    const obstacleSub = this.obstacleService.activeObstacles$.subscribe(obstacles => {
      this.obstacles = obstacles;
      this.collisionManager.updateObstacles(obstacles);
      this.cdr.detectChanges();
    });
    this.subscriptions.push(obstacleSub);

    const collisionSub = this.collisionManager.collision$.subscribe(collision => {
      if (collision.type === 'drag' || collision.type === 'rocket') {
        this.onCollisionDetected(collision.x, collision.y);
      }
    });
    this.subscriptions.push(collisionSub);

    this.loadLevelData(this.currentLevel);
    this.startObstacleAnimation();
    this.setupRocketMouseTracking();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.mouseMoveSub) {
      this.mouseMoveSub.unsubscribe();
    }

    if (this.mouseUpSub) {
      this.mouseUpSub.unsubscribe();
    }

    this.rocketService.destroy();
  }

  moveToNextQuestion(): void {
    this.feedbackState = 'default';

    const currentState = this.gameService.getCurrentGameState();

    if (currentState.currentQuestion >= currentState.totalQuestions) {
      this.isGameCompleted = true;
      this.finalScore = currentState.score;
      this.cdr.markForCheck();
      return;
    }

    const newLevel = currentState.currentLevel;
    if (this.currentLevel !== newLevel) {
      this.currentLevel = newLevel;
      this.loadLevelData(this.currentLevel);
    } else {
      this.loadLevelData(this.currentLevel);
    }

    this.cdr.markForCheck();
  }

  restartGame(): void {
    this.isGameCompleted = false;
    this.gameService.resetCurrentQuestion();
    this.currentLevel = 1;
    this.loadLevelData(this.currentLevel);
    this.cdr.markForCheck();
  }

  goToHome(): void {
    this.isGameCompleted = false;
    this.router.navigate(['/game']);
  }

  loadLevelData(levelId: number): void {
    this.feedbackState = 'default';
    this.gameService.resetMatches();

    const levelSub = this.gameService.getLevelInfo(levelId).subscribe(info => {
      const sourcesSub = this.gameService.getSourceImages().subscribe(sources => {
        this.sourceImages$.next(sources);

        const targetsSub = this.gameService.getTargetImages().subscribe(targets => {
          this.targetImages$.next(targets);
          this.organizeGameElements();
          this.cdr.markForCheck();
        });
        this.subscriptions.push(targetsSub);
      });
      this.subscriptions.push(sourcesSub);
    });
    this.subscriptions.push(levelSub);
  }

  toggleHint(): void {
    this.showHint = !this.showHint;

    if (this.showHint) {
      this.gameService.useHint();
    }

    this.cdr.markForCheck();
  }

  onImageDragged(image: SourceImageData): void {

  }

  onDropSuccess(event: { source: SourceImageData, target: TargetImageData }): void {
    const { source, target } = event;

    this.gameService.registerMatchAttempt(source, target);

    if (source.pair === target.pair) {
      this.soundService.playSuccessSound();
    } else {
      this.soundService.playDragSound();
    }

    this.cdr.markForCheck();
  }

  checkResult(): void {
    const uniquePairs = new Set(this.sourceImages$.getValue().map(img => img.pair));

    if (this.gameService.checkAllMatchesSuccessful(uniquePairs.size)) {
      this.soundService.playSuccessSound();
      this.showSuccessFeedback();
    } else {
      this.soundService.playFailureSound();
      this.showFailureFeedback();
    }
  }

  showSuccessFeedback(): void {
    this.feedbackState = 'success';
    this.cdr.markForCheck();
  }

  showFailureFeedback(): void {
    this.feedbackState = 'failure';
    this.cdr.markForCheck();
  }

  openConfigModal(): void {
    this.showConfigModal = true;
    this.cdr.markForCheck();
  }

  closeConfigModal(): void {
    this.showConfigModal = false;
    this.cdr.markForCheck();
  }

  saveConfigSettings(newConfig: GameDisplayConfig): void {
    this.gameDisplayService.setConfig(newConfig);
    this.closeConfigModal();

    setTimeout(() => {
      this.loadLevelData(this.currentLevel);
    }, 300);
  }

  isSourceImagePlaced(image: SourceImageData): boolean {
    return this.gameService.isSourcePlaced(image.id);
  }

  resetAfterFailure(): void {
    this.feedbackState = 'default';
    this.gameService.resetMatches();
    this.organizeGameElements();
    this.gameService.resetCurrentQuestion();
    this.cdr.markForCheck();
  }

  private setupRocketMouseTracking(): void {
    this.mouseMoveSub = fromEvent<MouseEvent>(this.document, 'mousemove')
      .pipe(throttleTime(16))
      .subscribe(event => {
        if (this.rocketService.isRocketActive()) {
          this.rocketService.updateRocketPosition(event.clientX, event.clientY);
        }
      });

    this.mouseUpSub = fromEvent<MouseEvent>(this.document, 'mouseup')
      .subscribe(event => {
        if (this.rocketService.isRocketActive()) {
          const { x, y } = this.rocketService.getRocketPosition();
          const elementAtPoint = this.document.elementFromPoint(x, y);

          if (!elementAtPoint?.closest('app-target-image')) {
            this.rocketService.returnRocketToSource();
          }
        }
      });
  }

  private organizeGameElements(): void {
    const sources = this.sourceImages$.getValue();
    const targets = this.targetImages$.getValue();
    const config = this.gameDisplayService.getCurrentConfig();

    const sourceElements: SourceGameElement[] = sources.map(img => ({
      type: 'source',
      data: img
    }));

    const targetElements: TargetGameElement[] = targets.map(tgt => ({
      type: 'target',
      data: tgt
    }));

    if (config.randomMode) {
      const allElements = [...sourceElements, ...targetElements];
      this.shuffleArray(allElements);

      const leftItems: GameElement[] = [];
      const rightItems: GameElement[] = [];

      allElements.forEach((element, index) => {
        if (index % 2 === 0) {
          leftItems.push(element);
        } else {
          rightItems.push(element);
        }
      });

      this.leftColumnItems$.next(leftItems);
      this.rightColumnItems$.next(rightItems);
    } else {
      this.leftColumnItems$.next(sourceElements);
      this.rightColumnItems$.next(targetElements);
    }
  }

  private applyDisplayConfig(config: GameDisplayConfig): void {
    if (!config) return;

    if (config.background.type === 'color') {
      this.backgroundImageUrl = null;
      this.backgroundColorValue = config.background.value;
    } else if (config.background.type === 'image') {
      this.backgroundImageUrl = config.background.value;
      this.backgroundColorValue = null;
    }

    document.documentElement.style.setProperty('--target-label-font-size', `${config.fontSize}px`);
    document.documentElement.style.setProperty('--game-image-size', `${config.imageSize}%`);
    document.documentElement.style.setProperty('--game-brightness', `${config.brightness}%`);

    if (config.feedback) {
      this.successMessage = config.feedback.success;
      this.failureMessage = config.feedback.failure;
    }

    this.obstaclesEnabled = config.obstaclesEnabled;
    this.rocketService.setObstaclesEnabled(this.obstaclesEnabled);

    if (this.obstaclesEnabled) {
      this.obstacleService.setDifficulty(config.difficulty);
    }
  }

  private onCollisionDetected(x: number, y: number): void {
    this.collisionDetected = true;
    this.showCollisionEffect(x, y);

    setTimeout(() => {
      this.collisionDetected = false;
      this.cdr.markForCheck();
    }, 1500);

    this.cdr.markForCheck();
  }

  private showCollisionEffect(x: number, y: number): void {
    const collisionDiv = this.renderer.createElement('div');
    this.renderer.addClass(collisionDiv, 'collision-effect');
    this.renderer.setStyle(collisionDiv, 'left', `${x}px`);
    this.renderer.setStyle(collisionDiv, 'top', `${y}px`);

    this.renderer.appendChild(this.elementRef.nativeElement, collisionDiv);

    setTimeout(() => {
      if (collisionDiv.parentNode) {
        this.renderer.removeChild(this.elementRef.nativeElement, collisionDiv);
      }
    }, 1000);
  }

  private startObstacleAnimation(): void {
    let lastTime = performance.now();

    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      if (this.obstaclesEnabled && this.obstacles.length > 0) {
        this.ngZone.run(() => {
          this.obstacleService.updateMovingObstacles(deltaTime);
          this.cdr.detectChanges();
        });
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
