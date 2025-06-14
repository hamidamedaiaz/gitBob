import {Component, OnInit} from '@angular/core';
import {Profile} from "../../../models/profile.model";
import {ProfileService} from "../../../services/profile.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-child-stats',
  templateUrl: './child-stats.component.html',
  styleUrls: ['./child-stats.component.scss']
})
export class ChildStatsComponent implements OnInit {
  profile?: Profile;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.profileService.getProfile(id).subscribe(p => {
      this.profile = p || undefined;
    });
  }
}
