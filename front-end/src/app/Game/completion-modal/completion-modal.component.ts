import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-completion-modal',
  templateUrl: './completion-modal.component.html',
  styleUrls: ['./completion-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletionModalComponent {
  @Input() finalScore: number = 0;
  @Input() show: boolean = false;

  @Output() restart = new EventEmitter<void>();
  @Output() home = new EventEmitter<void>();

  onRestartClick(): void {
    this.restart.emit();
  }

  onHomeClick(): void {
    this.home.emit();
  }
}
