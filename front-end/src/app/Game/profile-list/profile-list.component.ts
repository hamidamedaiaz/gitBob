import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProfileService} from '../../../services/profile.service';
import {Profile} from '../../../models/profile.model';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {
  profiles: Profile[] = [];
  filteredProfiles: Profile[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  maxDisplayProfiles: number = 10;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.loading = true;
    this.profileService.getProfiles().subscribe(profiles => {
      this.profiles = profiles;

      this.filteredProfiles = profiles.slice(0, this.maxDisplayProfiles);
      this.loading = false;
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;

    if (!term) {
      this.filteredProfiles = this.profiles.slice(0, this.maxDisplayProfiles);
      return;
    }

    this.profileService.searchProfiles(term).subscribe(results => {

      this.filteredProfiles = results.slice(0, this.maxDisplayProfiles);
    });
  }

  onProfileSelected(profile: Profile): void {
    this.profileService.selectProfile(profile);
    this.router.navigate(['/themes']);
  }
}
