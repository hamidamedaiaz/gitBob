import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Theme} from '../../../models/theme.model';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent {
  @Input() theme!: Theme;
  @Input() borderColor = '#8B00FF';
  @Output() themeSelected = new EventEmitter<Theme>();
  @Output() themeDeleted = new EventEmitter<string>();
  @Input() showButton = true;
  @Input() showDeleteButton = false
  isConfirmingDelete = false;

  onSelect(): void {
    this.themeSelected.emit(this.theme);
  }

  onDelete(): void {
    this.themeDeleted.emit(this.theme.id);
  }

  onAskDelete(): void {
    this.isConfirmingDelete = true;
  }

  onConfirmDelete(): void {
    this.isConfirmingDelete = false;
    this.themeDeleted.emit(this.theme.id);
  }

  onCancelDelete(): void {
    this.isConfirmingDelete = false;
  }
}
