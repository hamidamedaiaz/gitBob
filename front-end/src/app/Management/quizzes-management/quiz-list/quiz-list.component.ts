import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Quiz} from '../../../../models/quiz.model';
import {QuizComponent} from '../quiz/quiz.component';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [CommonModule, QuizComponent],
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent {
  /** Liste des quizzes à afficher */
  @Input() quizzes: Quiz[] = [];
  /** Émission quand on sélectionne un quiz (pour le parent) */
  @Output() quizSelected = new EventEmitter<Quiz>();
  /** Émission quand on veut éditer un quiz */
  @Output() editQuiz = new EventEmitter<Quiz>();
  /** Émission quand on veut supprimer un quiz */
  @Output() deleteQuiz = new EventEmitter<Quiz>();
}
