import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameService} from '../../../services/game.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-success-feedback',
  templateUrl: './success-feedback.component.html',
  styleUrls: ['./success-feedback.component.scss']
})
export class SuccessFeedbackComponent {
  @Input() successMessage: string = "Bravo! Tu as réussi cette question avec brio! 🌟✨ Continue comme ça, tu es sur la bonne voie";
  @Output() nextQuestionEvent = new EventEmitter<void>();

  constructor(private gameService: GameService, private router: Router) {
  }

  nextQuestion(): void {
    console.log('Next question button clicked in success feedback component');

    this.gameService.advanceToNextQuestion();

    this.nextQuestionEvent.emit();
  }
}
