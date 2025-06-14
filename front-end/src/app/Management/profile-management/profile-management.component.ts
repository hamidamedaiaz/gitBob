import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Profile} from '../../../models/profile.model';
import {ProfileExtended} from '../../../models/profile-extended.model';
import {ProfileService} from '../../../services/profile.service';
import {ProfileCreateComponent} from './profile-create/profile-create.component';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile-management',
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProfileCreateComponent,
    ProfileEditComponent
  ]
})
export class ProfileManagementComponent implements OnInit {
  profiles: ProfileExtended[] = [];
  filteredProfiles: ProfileExtended[] = [];

  searchQuery: string = '';
  selectedFilter: string = 'alpha';

  selectedProfile: ProfileExtended | null = null;
  showEditMode: boolean = false;
  showCreateMode: boolean = false;


  profileToDelete: ProfileExtended | null = null;
  showConfirmDelete: boolean = false;

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadProfiles();
  }



  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterProfiles();
  }

  onFilterChange(event: Event): void {
    this.selectedFilter = (event.target as HTMLSelectElement).value;
    this.filterProfiles();
  }

  filterProfiles(): void {

    let filtered = [...this.profiles];
    if (this.searchQuery.trim()) {
      const term = this.searchQuery.toLowerCase();
      filtered = filtered.filter(profile =>
        profile.firstName.toLowerCase().includes(term) ||
        profile.lastName.toLowerCase().includes(term)
      );
    }


    if (this.selectedFilter === 'alpha') {
      filtered.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (this.selectedFilter === 'date') {
      filtered.sort((a, b) =>
        new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
      );
    } else if (this.selectedFilter === 'quizzes') {
      filtered.sort((a, b) => b.quizzesDone - a.quizzesDone);
    }

    this.filteredProfiles = filtered;
  }

  selectProfile(profile: ProfileExtended): void {
    this.selectedProfile = profile;
    this.showEditMode = false;
    this.showCreateMode = false;
  }

  editProfile(profile: ProfileExtended): void {
    this.selectedProfile = profile;
    this.showEditMode = true;
    this.showCreateMode = false;
  }

  createProfile(): void {
    this.selectedProfile = null;
    this.showCreateMode = true;
    this.showEditMode = false;
  }





  deleteProfile(profile: ProfileExtended): void {
    this.profileToDelete = profile;
    this.showConfirmDelete = true;
  }

  confirmDelete(): void {
    if (!this.profileToDelete) return;

    console.log('Attempting to delete profile with ID:', this.profileToDelete.id);

    // Call the actual delete service
    this.profileService.deleteProfile(this.profileToDelete.id).subscribe({
      next: () => {
        console.log('Profile deleted successfully from backend');

        // Clear selected profile if it was the deleted one
        if (
          this.selectedProfile &&
          this.selectedProfile.id === this.profileToDelete!.id
        ) {
          this.selectedProfile = null;
        }

        // Reload profiles from backend to ensure consistency
        this.loadProfiles();

        // Reset modal state
        this.showConfirmDelete = false;
        this.profileToDelete = null;
      },
      error: (error) => {
        console.error('Detailed error deleting profile:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);

        let errorMessage = 'Erreur lors de la suppression du profil.';

        if (error.status === 404) {
          errorMessage = 'Profil non trouvé.';
        } else if (error.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else if (error.status === 0) {
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        }

        alert(errorMessage);

        // Reset modal state even on error
        this.showConfirmDelete = false;
        this.profileToDelete = null;
      }
    });
  }

  onProfileCreated(profile: Profile): void {
    // After creating, reload the list from backend
    this.loadProfiles();
    this.showCreateMode = false;
  }

  onProfileUpdated(profile: ProfileExtended): void {
    // After updating, reload the list from backend
    this.loadProfiles();
    this.showEditMode = false;
  }

  cancelDelete(): void {

    this.showConfirmDelete = false;
    this.profileToDelete = null;
  }

  cancelCreate(): void {
    this.showCreateMode = false;
  }
  loadProfiles(): void {
    console.log('Loading profiles from backend...');
    this.profileService.getProfiles().subscribe({
      next: (profiles) => {
        console.log('Profiles loaded:', profiles);
        // Convert profiles to ProfileExtended format
        this.profiles = profiles.map(p => {
          return {
            ...p,
            favoriteQuizIds: (p as ProfileExtended).favoriteQuizIds || []
          } as ProfileExtended;
        });
        this.filterProfiles();
      },
      error: (error) => {
        console.error('Error loading profiles:', error);
        // Handle error gracefully
        this.profiles = [];
        this.filteredProfiles = [];
      }
    });
  }

  cancelEdit(): void {
    this.showEditMode = false;
  }

  viewStats(profile: ProfileExtended): void {
    this.router.navigate(['/child-stats', profile.id]);
  }


  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
