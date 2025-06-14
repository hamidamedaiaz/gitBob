import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {GAME_LEVELS} from '../mocks/game-data.mock';
import {GameDisplayConfig} from "../models/game-display-config.model";
import {GameDisplayService} from "./game-display.service";
import {SourceImageData} from '../app/Game/source-image/source-image.component';
import {TargetImageData} from '../app/Game/target-image/target-image.component';
import {Quiz} from "../models/quiz.model";

export interface GameState {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  hintUsed: boolean;
  currentLevel: number;
  displayConfig: GameDisplayConfig | null;
  gameCompleted: boolean;
  gameStartTime: number;
  gameTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private initialState: GameState = {
    currentQuestion: 1,
    totalQuestions: 4,
    score: 0,
    hintUsed: false,
    currentLevel: 1,
    displayConfig: null,
    gameCompleted: false,
    gameStartTime: Date.now(),
    gameTime: 0
  };

  private gameStateSubject = new BehaviorSubject<GameState>(this.initialState);
  gameState$ = this.gameStateSubject.asObservable();
  private placedImages = new Set<number>();
  private successfulMatches = new Map<number, number>();
  private currentLevelIndex = 0;

  constructor(private gameDisplayService: GameDisplayService) {
    console.log('GameService initialized');


    const displayConfig = this.gameDisplayService.getCurrentConfig();
    this.updateGameState({displayConfig});


    this.gameDisplayService.getConfig().subscribe(config => {
      console.log('Game service: display config updated');
      this.updateGameState({displayConfig: config});
    });
  }


  private selectedQuizSubject = new BehaviorSubject<Quiz | null>(null);
  selectedQuiz$ = this.selectedQuizSubject.asObservable();

  setSelectedQuiz(quiz: Quiz): void {
    this.selectedQuizSubject.next(quiz);
  }


  getSelectedQuiz(): Quiz | null {
    return this.selectedQuizSubject.getValue();
  }


  isSourcePlaced(sourceId: number): boolean {
    return this.placedImages.has(sourceId);
  }


  loadCurrentQuestion(): void {
    const quiz = this.getSelectedQuiz();
    const currentState = this.getCurrentGameState();
    if (!quiz || !quiz.questions || currentState.currentQuestion > quiz.questions.length) return;

    const question = quiz.questions[currentState.currentQuestion - 1];
    const pairs = question.pairs || [];

    this.customSources = pairs.map((pair, i) => ({
      id: i + 1,
      alt: pair.description || `Source ${i + 1}`,
      pair: i + 1,
      src: pair.sourceImage?.preview || 'assets/default.jpg'
    }));

    this.customTargets = pairs.map((pair, i) => ({
      id: i + 1,
      alt: pair.description || `Target ${i + 1}`,
      label: pair.description || '',
      pair: i + 1,
      src: pair.targetImage?.preview || 'assets/default.jpg'
    }));

    this.resetMatches();
  }


  private customSources: SourceImageData[] = [];
  private customTargets: TargetImageData[] = [];


  loadQuiz(quiz: Quiz): void {
    if (!quiz.questions || quiz.questions.length === 0) return;

    this.setSelectedQuiz(quiz);

    const firstQuestion = quiz.questions[0];
    const pairs = firstQuestion.pairs || [];

    this.customSources = pairs.map((pair, i) => ({
      id: i + 1,
      alt: pair.description || `Source ${i + 1}`,
      pair: i + 1,
      src: pair.sourceImage?.preview || 'assets/default.jpg'  // ✅ Utilise .preview
    }));

    this.customTargets = pairs.map((pair, i) => ({
      id: i + 1,
      alt: pair.description || `Target ${i + 1}`,
      label: pair.description || '',
      pair: i + 1,
      src: pair.targetImage?.preview || 'assets/default.jpg'  // ✅ Utilise .preview
    }));

    this.updateGameState({
      totalQuestions: quiz.questions.length,
      currentQuestion: 1,
      score: 0,
      hintUsed: false,
      gameCompleted: false,
      gameStartTime: Date.now(),
      gameTime: 0,
      displayConfig: this.mapQuizConfigToGameDisplayConfig(quiz.config)
    });

    this.resetMatches();
  }

  private mapQuizConfigToGameDisplayConfig(config: any): GameDisplayConfig {
    return {
      fontSize: config.taillePolice ?? 16,
      imageSize: config.tailleImage ?? 100,
      brightness: config.luminosite ?? 100,
      feedback: {
        success: config.feedbackSucces ?? 'Bravo !',
        failure: config.feedbackEchec ?? 'Essaie encore !'
      },

      background: config.background || { type: 'color', value: '#ffffff' },
      randomMode: config.ordreAleatoire ?? false,
      obstaclesEnabled: config.chronometre ?? false,
      difficulty: 'easy' // optionnel : adapter dynamiquement
    };
  }




  registerMatchAttempt(source: SourceImageData, target: TargetImageData): void {
    console.log(`Registering match attempt: source ${source.id} to target ${target.id}`);


    this.placedImages.add(source.id);


    if (source.pair === target.pair) {
      console.log('Correct match! Recording and updating score');
      this.successfulMatches.set(source.pair, target.pair);
      this.updateScore(10);
    } else {
      console.log('Incorrect match');
    }

    console.log('Placed images:', [...this.placedImages]);
    console.log('Successful matches:', [...this.successfulMatches.entries()]);
  }

  resetMatches(): void {
    console.log('Resetting all matches');
    this.placedImages.clear();
    this.successfulMatches.clear();
  }

  getSourceById(id: number): Observable<SourceImageData | null> {
    return new Observable<SourceImageData | null>(observer => {
      this.getSourceImages().subscribe(sources => {
        const source = sources.find(s => s.id === id);
        observer.next(source || null);
        observer.complete();
      });
    });
  }

  resetCurrentQuestion(): void {
    console.log('Resetting current question');
    this.resetMatches();
    this.updateGameState({hintUsed: false});
  }


  updateScore(points: number): void {
    const currentState = this.gameStateSubject.getValue();
    this.updateGameState({
      score: currentState.score + points
    });
  }


  useHint(): void {
    this.updateGameState({hintUsed: true});
  }


  checkAllMatchesSuccessful(requiredPairsCount: number): boolean {
    return this.successfulMatches.size === requiredPairsCount;
  }


  getCurrentLevel(): number {
    return this.gameStateSubject.getValue().currentLevel;
  }


  setCurrentLevel(levelId: number): void {
    console.log('Setting current level to:', levelId);
    const index = GAME_LEVELS.findIndex(l => l.id === levelId);
    if (index !== -1) {
      this.currentLevelIndex = index;
      this.updateGameState({currentLevel: levelId});
      this.resetMatches();
    } else {
      console.warn('Level ID not found:', levelId);
    }
  }


  getSuccessfulMatchesCount(): number {
    return this.successfulMatches.size;
  }

  getSourceImages(): Observable<SourceImageData[]> {
    return of(GAME_LEVELS[this.currentLevelIndex].sourceImages);
  }

  getTargetImages(): Observable<TargetImageData[]> {
    return of(GAME_LEVELS[this.currentLevelIndex].targetImages);
  }

  getLevelInfo(levelId: number): Observable<any> {
    const level = GAME_LEVELS.find(l => l.id === levelId);
    return of(level || GAME_LEVELS[0]);
  }

  getCurrentGameState(): GameState {
    return this.gameStateSubject.getValue();
  }

  checkGameCompletion(): boolean {
    const state = this.gameStateSubject.getValue();
    return state.currentQuestion > state.totalQuestions;
  }

  advanceToNextQuestion(): void {
    console.log('Advancing to next question');
    const currentState = this.gameStateSubject.getValue();

    if (currentState.currentQuestion < currentState.totalQuestions) {
      const nextQuestion = currentState.currentQuestion + 1;
      this.updateGameState({
        currentQuestion: nextQuestion,
        hintUsed: false
      });

      this.resetMatches();


      let newLevel;

      if (currentState.totalQuestions <= 3) {

        newLevel = nextQuestion;
      } else {

        if (nextQuestion <= Math.floor(currentState.totalQuestions / 3)) {
          newLevel = 1;
        } else if (nextQuestion <= Math.floor(2 * currentState.totalQuestions / 3)) {
          newLevel = 2;
        } else {
          newLevel = 3;
        }
      }

      if (newLevel !== currentState.currentLevel) {
        this.setCurrentLevel(newLevel);
      }

      console.log('Advanced to question', nextQuestion, 'level', this.getCurrentGameState().currentLevel);
    } else {
      console.log('Game completed! All questions finished.');


      const gameEndTime = Date.now();
      const totalTimeInSeconds = (gameEndTime - currentState.gameStartTime) / 1000;


      this.updateGameState({
        gameCompleted: true,
        gameTime: totalTimeInSeconds
      });
    }
  }

  resetGame(): void {
    console.log('Resetting game to initial state');


    const resetState = {
      ...this.initialState,
      gameStartTime: Date.now()
    };

    this.gameStateSubject.next(resetState);
    this.resetMatches();


    this.currentLevelIndex = 0;
  }

  private updateGameState(partialState: Partial<GameState>): void {
    const currentState = this.gameStateSubject.getValue();
    const newState = {...currentState, ...partialState};
    console.log('Updating game state:', newState);
    this.gameStateSubject.next(newState);
  }
}
