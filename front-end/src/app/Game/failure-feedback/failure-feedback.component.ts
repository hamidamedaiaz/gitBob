import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameService} from '../../../services/game.service';

@Component({
  selector: 'app-failure-feedback',
  templateUrl: './failure-feedback.component.html',
  styleUrls: ['./failure-feedback.component.scss']
})
export class FailureFeedbackComponent {
  @Input() failureMessage: string = "Oups! Ce n'est pas encore ça, mais tu peux essayer encore 🎈💪ou Veux-tu un indice?";
  @Output() retryEvent = new EventEmitter<void>();
  @Output() showHintEvent = new EventEmitter<void>();

  constructor(private gameService: GameService) {
  }

  showHint(): void {
    this.showHintEvent.emit();
    this.gameService.resetCurrentQuestion();

    this.retryEvent.emit();
  }

  retry(): void {
    console.log('Retry clicked in failure feedback component');
    this.gameService.resetCurrentQuestion();

    this.retryEvent.emit();
  }
}
