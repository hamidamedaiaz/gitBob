import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private successSound: HTMLAudioElement;
  private failureSound: HTMLAudioElement;
  private dragSound: HTMLAudioElement;
  private hintSound: HTMLAudioElement;
  private soundEnabled = true;
  private speechEnabled = true;
  private speechSynthesis: SpeechSynthesis;
  private speechVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    console.log('SoundService initialized');

    this.successSound = new Audio();
    this.failureSound = new Audio();
    this.dragSound = new Audio();
    this.hintSound = new Audio();

    this.successSound.src = 'assets/success.mp3';
    this.failureSound.src = 'assets/failurefeedback.wav';
    this.dragSound.src = 'assets/drag.wav';
    this.hintSound.src = 'assets/hint.mp3';


    this.loadSounds();

    this.speechSynthesis = window.speechSynthesis;
    this.loadVoices();

    if (this.speechSynthesis.onvoiceschanged !== undefined) {
      this.speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  /**
   * Play success sound with error handling
   */
  playSuccessSound(): void {
    if (!this.soundEnabled) return;

    try {
      const soundClone = this.successSound.cloneNode() as HTMLAudioElement;

      const playPromise = soundClone.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Error playing success sound:', error);
        });
      }
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  }

  /**
   * Play failure sound with error handling
   */
  playFailureSound(): void {
    if (!this.soundEnabled) return;

    try {
      const soundClone = this.failureSound.cloneNode() as HTMLAudioElement;

      const playPromise = soundClone.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Error playing failure sound:', error);
        });
      }
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  }

  /**
   * Play drag sound with error handling
   */
  playDragSound(): void {
    if (!this.soundEnabled) return;

    try {
      const soundClone = this.dragSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5; // Lower volume for drag sound

      const playPromise = soundClone.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Error playing drag sound:', error);
        });
      }
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  }

  /**
   * Play hint sound with error handling
   */
  playHintSound(): void {
    if (!this.soundEnabled) return;

    try {
      const soundClone = this.hintSound.cloneNode() as HTMLAudioElement;

      const playPromise = soundClone.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Error playing hint sound:', error);
        });
      }
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  }

  /**
   * Speak text using speech synthesis
   */
  speakText(text: string, lang: string = 'fr-FR'): void {
    if (!this.speechEnabled) return;

    try {
      this.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      const frenchVoice = this.getFrenchVoice();
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      this.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis error:', error);
    }
  }

  /**
   * Enable or disable sounds
   */
  setSoundEnabled(enabled: boolean): void {
    console.log('Setting sound enabled:', enabled);
    this.soundEnabled = enabled;
  }

  /**
   * Enable or disable speech
   */
  setSpeechEnabled(enabled: boolean): void {
    console.log('Setting speech enabled:', enabled);
    this.speechEnabled = enabled;
  }

  /**
   * Check if sound is enabled
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Check if speech is enabled
   */
  isSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  /**
   * Toggle sound on/off
   */
  toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    console.log('Toggled sound:', this.soundEnabled ? 'on' : 'off');
    return this.soundEnabled;
  }

  /**
   * Toggle speech on/off
   */
  toggleSpeech(): boolean {
    this.speechEnabled = !this.speechEnabled;
    console.log('Toggled speech:', this.speechEnabled ? 'on' : 'off');
    return this.speechEnabled;
  }

  private loadVoices(): void {
    try {
      this.speechVoices = this.speechSynthesis.getVoices();
      console.log('Text-to-speech voices loaded:', this.speechVoices.length);
    } catch (error) {
      console.warn('Error loading speech voices:', error);
    }
  }

  private getFrenchVoice(): SpeechSynthesisVoice | null {
    const frenchVoice = this.speechVoices.find(voice =>
      voice.lang.includes('fr') || voice.name.toLowerCase().includes('french')
    );

    return frenchVoice || null;
  }

  private loadSounds(): void {
    try {
      this.successSound.load();
      this.failureSound.load();
      this.dragSound.load();
      this.hintSound.load();
    } catch (error) {
      console.warn('Error preloading sounds:', error);
    }
  }
}
