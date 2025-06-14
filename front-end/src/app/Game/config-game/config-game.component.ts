import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {GameDisplayService} from '../../../services/game-display.service';
import {GameDisplayConfig} from '../../../models/game-display-config.model';
import {SoundService} from "../../../services/sound.service";
import {ObstacleService} from "../../../services/obstacle.service";

@Component({
  selector: 'app-config-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-game.component.html',
  styleUrls: ['./config-game.component.scss']
})
export class ConfigGameComponent implements OnInit {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<GameDisplayConfig>();

  // Configuration options
  soundEnabled = true;
  randomMode = false;
  timerEnabled = true;
  fontSize = 'medium';
  imageSize = 'medium';
  brightnessValue = 100;
  selectedBackground = 'color-blue';

  // New obstacle settings
  obstaclesEnabled = false;
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  fontSizeMap = {
    'small': 12,
    'medium': 16,
    'large': 24
  };

  imageSizeMap = {
    'small': 70,
    'medium': 100,
    'large': 130
  };

  backgroundOptions = [
    {id: 'color-blue', name: 'Ciel Bleu', type: 'color', value: '#3498db'},
    {id: 'color-noir', name: 'Mode sombre', type: 'color', value: '#0b100b'},
    {id: 'color-purple', name: 'Magie Violette', type: 'color', value: '#9b59b6'},
    {id: 'image-stars', name: 'Étoiles', type: 'image', value: 'assets/background.jpg'},
    {id: 'image-clouds', name: 'Nuages', type: 'image', value: 'assets/homeBackground.jpg'}
  ];

  constructor(
    private gameDisplayService: GameDisplayService,
    private soundService: SoundService,
    private obstacleService: ObstacleService
  ) {
  }

  ngOnInit() {
    // Load current configuration
    const currentConfig = this.gameDisplayService.getCurrentConfig();
    console.log('Current config loaded:', currentConfig);

    // Map the current config to our UI values
    this.randomMode = currentConfig.randomMode;
    this.fontSize = this.mapFontSizeToOption(currentConfig.fontSize);
    this.imageSize = this.mapImageSizeToOption(currentConfig.imageSize);
    this.brightnessValue = currentConfig.brightness;
    this.selectedBackground = this.findBackgroundOption(currentConfig.background);
    this.soundEnabled = currentConfig.soundEnabled !== undefined ? currentConfig.soundEnabled : true;

    // Load obstacle settings
    this.obstaclesEnabled = currentConfig.obstaclesEnabled || false;
    this.difficulty = currentConfig.difficulty || 'easy';

    // Update sound service with the setting
    this.soundService.setSoundEnabled(this.soundEnabled);

    console.log('UI values set:', {
      randomMode: this.randomMode,
      fontSize: this.fontSize,
      imageSize: this.imageSize,
      brightness: this.brightnessValue,
      selectedBackground: this.selectedBackground,
      obstaclesEnabled: this.obstaclesEnabled,
      difficulty: this.difficulty
    });
  }

  closeModal() {
    this.close.emit();
  }

  saveSettings() {
    const selectedBg = this.backgroundOptions.find(bg => bg.id === this.selectedBackground);

    if (!selectedBg) {
      console.error('Selected background not found in options:', this.selectedBackground);
      return;
    }

    console.log('Selected background:', selectedBg);

    const config: GameDisplayConfig = {
      fontSize: this.fontSizeMap[this.fontSize as keyof typeof this.fontSizeMap],
      imageSize: this.imageSizeMap[this.imageSize as keyof typeof this.imageSizeMap],
      brightness: this.brightnessValue,
      background: {
        type: selectedBg.type as 'color' | 'image' | 'video',
        value: selectedBg.value
      },
      feedback: {
        success: "Bravo! Tu as réussi! 🎉",
        failure: "Essaie encore, tu peux y arriver! 💪"
      },
      randomMode: this.randomMode,
      soundEnabled: this.soundEnabled,
      obstaclesEnabled: this.obstaclesEnabled,
      difficulty: this.difficulty
    };

    console.log('Saving config:', config);
    this.save.emit(config);
    this.gameDisplayService.setConfig(config);
    this.close.emit();
  }

  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
    this.soundService.setSoundEnabled(this.soundEnabled);

    if (this.soundEnabled) {
      this.soundService.playSuccessSound();
    }
  }

  // Set the difficulty level
  setDifficulty(level: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = level;

    // Play a sound to indicate the change
    if (this.soundEnabled) {
      if (level === 'easy') {
        this.soundService.playDragSound();
      } else if (level === 'medium') {
        this.soundService.playDragSound();
      } else {
        this.soundService.playDragSound();
      }
    }
  }

  private mapFontSizeToOption(fontSize: number): string {
    if (fontSize <= 12) return 'small';
    if (fontSize >= 20) return 'large';
    return 'medium';
  }

  private mapImageSizeToOption(imageSize: number): string {
    if (imageSize <= 70) return 'small';
    if (imageSize >= 130) return 'large';
    return 'medium';
  }

  private findBackgroundOption(background: any): string {
    if (!background) {
      console.warn('Background is undefined, using default');
      return 'color-blue';
    }

    console.log('Finding background option for:', background);

    const option = this.backgroundOptions.find(opt =>
      opt.type === background.type && opt.value === background.value
    );

    if (option) {
      console.log('Found background option:', option.id);
      return option.id;
    } else {
      const typeMatch = this.backgroundOptions.find(opt => opt.type === background.type);
      if (typeMatch) {
        console.log('Found type match for background:', typeMatch.id);
        return typeMatch.id;
      }
      console.warn('No background option found, using default');
      return 'color-blue';
    }
  }
}
