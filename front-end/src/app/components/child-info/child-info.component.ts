import {Component, Input, OnInit} from '@angular/core';
import {Child} from 'src/models/child.model';
import {ChildStatsService} from 'src/services/child-stats.service';
import {Profile} from 'src/models/profile.model';
import {ProfileService} from "../../../services/profile.service";

@Component({
  selector: 'app-child-info',
  templateUrl: './child-info.component.html',
  styleUrls: ['./child-info.component.scss']
})
export class ChildInfoComponent implements OnInit {

  @Input() child!: Child;
  @Input() profile?: Profile;


  constructor(private childStatsService: ChildStatsService, private profileService: ProfileService) {
  }

  ngOnInit(): void {
    this.child = this.childStatsService.getChildInfo();
    if (this.profile) {
      this.profileService.getProfile(this.profile.id)
        .subscribe(p => this.profile = p);
    }
  }
}
