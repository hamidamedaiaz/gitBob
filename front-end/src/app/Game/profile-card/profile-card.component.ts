import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Profile} from '../../../models/profile.model';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
  @Output() profileSelected = new EventEmitter<Profile>();

  selectProfile(): void {
    this.profileSelected.emit(this.profile);
  }

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
