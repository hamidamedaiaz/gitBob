import {Component, Input} from '@angular/core';
import {Profile} from 'src/models/profile.model';

@Component({
  selector: 'app-profile-stats-card',
  templateUrl: './profile-stats-card.component.html',
  styleUrls: ['./profile-stats-card.component.scss']
})
export class ProfileStatsCardComponent {
  @Input() profile!: Profile;
}
