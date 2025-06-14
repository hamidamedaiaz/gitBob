import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Quiz} from '../../../../models/quiz.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @Input() quiz!: Quiz;
  @Output() quizSelected = new EventEmitter<void>();
  @Output() editQuiz = new EventEmitter<Quiz>();
  @Output() deleteQuiz = new EventEmitter<Quiz>();

  constructor() {
  }

  ngOnInit(): void {
  }

  selectQuiz(): void {
    this.quizSelected.emit();
  }

  edit(event?: Event): void {
  if (event) {
    event.stopPropagation();
  }
  console.log('Editing quiz:', this.quiz);
  this.editQuiz.emit(this.quiz); // this.quiz existe car c'est un @Input()
}

  delete(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.deleteQuiz.emit(this.quiz);
  }
}
