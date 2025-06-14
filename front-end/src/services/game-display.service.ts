import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {GameDisplayConfig} from '../models/game-display-config.model';
import {ObstacleService} from './obstacle.service';

@Injectable({
  providedIn: 'root'
})
export class GameDisplayService {

  private defaultConfig: GameDisplayConfig = {
    fontSize: 16,
    imageSize: 100,
    brightness: 100,
    background: {
      type: 'image',
      value: 'assets/background.jpg'
    },
    feedback: {
      success: "Bravo! Tu as réussi! 🎉",
      failure: "Essaie encore, tu peux y arriver! 💪"
    },
    randomMode: false,
    soundEnabled: true,
    difficulty: 'easy',      // Default to easy difficulty
    obstaclesEnabled: false  // Obstacles disabled by default
  };

  private currentConfig: GameDisplayConfig;
  private configSubject: BehaviorSubject<GameDisplayConfig>;


  constructor(private obstacleService: ObstacleService) {
    // Initialize with default config

    this.currentConfig = {...this.defaultConfig};
    this.configSubject = new BehaviorSubject<GameDisplayConfig>(this.currentConfig);
    console.log('GameDisplayService initialized with config:', this.currentConfig);
  }

  getConfig(): Observable<GameDisplayConfig> {
    return this.configSubject.asObservable();
  }

  getCurrentConfig(): GameDisplayConfig {
    return {...this.currentConfig};
  }

  setConfig(config: GameDisplayConfig): void {
    console.log('Setting new config:', config);

    const completeConfig = {
      ...this.currentConfig,
      ...config,
      background: {
        ...this.currentConfig.background,
        ...config.background
      },
      feedback: {
        ...this.currentConfig.feedback,
        ...config.feedback
      }
    };

    if (!['color', 'image', 'video'].includes(completeConfig.background.type)) {
      console.warn('Invalid background type:', completeConfig.background.type);
      completeConfig.background.type = 'color';
    }
    if (!completeConfig.background.value) {
      console.warn('Missing background value, using default');
      completeConfig.background.value = this.defaultConfig.background.value;
    }


    // Update obstacle service with new difficulty if it has changed
    if (completeConfig.difficulty !== this.currentConfig.difficulty ||
      completeConfig.obstaclesEnabled !== this.currentConfig.obstaclesEnabled) {

      if (completeConfig.obstaclesEnabled) {
        this.obstacleService.setDifficulty(completeConfig.difficulty);
      } else {
        // If obstacles are disabled, set a placeholder with no obstacles
        this.obstacleService.setDifficulty('easy');
      }
    }


    this.currentConfig = completeConfig;

    this.configSubject.next(this.currentConfig);
    console.log('New config applied:', this.currentConfig);

    this.saveToLocalStorage();
  }

  saveFromConfigForm(formValue: any): void {
    const displayConfig: GameDisplayConfig = {
      fontSize: formValue.fontSize,
      imageSize: formValue.imageSize,
      brightness: formValue.brightness,
      background: formValue.background,
      feedback: {
        success: formValue.feedbackSuccess || this.defaultConfig.feedback.success,
        failure: formValue.feedbackFail || this.defaultConfig.feedback.failure
      },
      randomMode: formValue.handleRandomOption === 'oui',
      soundEnabled: formValue.soundEnabled === 'oui',
      difficulty: formValue.difficulty || 'easy',
      obstaclesEnabled: formValue.obstaclesEnabled === 'oui'
    };

    console.log('Display Configuration saved from form:', displayConfig);
    this.setConfig(displayConfig);
  }

  resetToDefault(): void {
    this.currentConfig = {...this.defaultConfig};
    this.configSubject.next(this.currentConfig);
    this.saveToLocalStorage();
  }

  toggleSound(): boolean {
    const newConfig = {
      ...this.currentConfig,
      soundEnabled: !this.currentConfig.soundEnabled
    };
    this.setConfig(newConfig);
    return newConfig.soundEnabled;
  }

  loadFromLocalStorage(): void {
    try {
      const savedConfig = localStorage.getItem('gameDisplayConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        this.setConfig(parsedConfig);
      }
    } catch (error) {
      console.error('Error loading config from local storage:', error);
      this.resetToDefault();
    }
  }

  // Toggle obstacles
  toggleObstacles(): boolean {
    const newConfig = {
      ...this.currentConfig,
      obstaclesEnabled: !this.currentConfig.obstaclesEnabled
    };
    this.setConfig(newConfig);
    return newConfig.obstaclesEnabled;
  }

  // Set game difficulty
  setDifficulty(difficulty: 'easy' | 'medium' | 'hard'): void {
    const newConfig = {
      ...this.currentConfig,
      difficulty
    };
    this.setConfig(newConfig);
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('gameDisplayConfig', JSON.stringify(this.currentConfig));
    } catch (error) {
      console.error('Error saving config to local storage:', error);
    }
  }
}
