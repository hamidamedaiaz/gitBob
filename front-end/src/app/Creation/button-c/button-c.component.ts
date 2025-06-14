import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-my-button',
  templateUrl: './button-c.component.html',
  standalone: true,
  styleUrls: ['./button-c.component.html']
})
export class ButtonCComponent {
  @Input() label: string = 'Bouton';
  @Input() type: string = 'button';
  @Output() clickEvent = new EventEmitter<void>();

  onClick(): void {
    this.clickEvent.emit();
  }

}
