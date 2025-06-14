// Dans front-end/src/app/Creation/quiz-footer-navigation/quiz-footer-navigation.component.ts
// Mise à jour complète du composant :

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-footer-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-footer-navigation.component.html',
  styleUrls: ['./quiz-footer-navigation.component.scss']
})
export class QuizFooterNavigationComponent {
  @Input() currentStep: number = 1;
  @Input() canProceedToNextStep!: () => boolean;
  @Input() prevStep!: () => void;
  @Input() nextStep!: () => void;
  @Input() saveQuiz!: () => void;
  @Input() isLoading: boolean = false;
  @Input() isEditMode: boolean = false; // Nouvelle propriété pour le mode édition
}