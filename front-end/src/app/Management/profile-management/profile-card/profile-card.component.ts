import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileExtended} from '../../../../models/profile-extended.model';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ProfileCardComponent {
  @Input() profile!: ProfileExtended;
  @Input() showDetails: boolean = true;
  @Output() profileSelected = new EventEmitter<ProfileExtended>();


  get truncatedName(): string {
    const fullName = `${this.profile.firstName} ${this.profile.lastName}`;
    return fullName.length > 20 ? fullName.substring(0, 18) + '...' : fullName;
  }


  get formattedDate(): string {
    return new Date(this.profile.registrationDate).toLocaleDateString('fr-FR');
  }

  onSelect(): void {
    this.profileSelected.emit(this.profile);
  }
}
