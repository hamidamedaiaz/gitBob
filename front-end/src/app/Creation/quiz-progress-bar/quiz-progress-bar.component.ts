import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-quiz-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-progress-bar.component.html',
  styleUrls: ['./quiz-progress-bar.component.scss']
})
export class QuizProgressBarComponent {
  @Input() currentStep: number = 1;
}
