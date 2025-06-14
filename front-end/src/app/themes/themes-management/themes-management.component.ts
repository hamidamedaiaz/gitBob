import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ThemeService} from '../../../services/theme.service';
import {Theme} from '../../../models/theme.model';
import {ThemeListComponent} from '../theme-list/theme-list.component';
import {ThemeComponent} from '../theme/theme.component';
import {FileInputComponent} from "../../Creation/file-input/file-input.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-themes-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeListComponent,
    ThemeComponent,
    FileInputComponent
  ],
  templateUrl: './themes-management.component.html',
  styleUrls: ['./themes-management.component.scss']
})
export class ThemesManagementComponent implements OnInit {
  themes: Theme[] = [];
  addForm: FormGroup;
  retour: string | null = null;
  private borderColors = ['#8B00FF', '#FF6347', '#4169E1', '#32CD32'];

  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) {
    this.addForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      imageUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const state = this.location.getState() as { retour?: string };
    this.retour = state.retour ?? null;
    this.loadThemes();
  }

  /** appelé depuis le template pour chaque carte */
  getBorderColor(index: number): string {
    return this.borderColors[index % this.borderColors.length];
  }

  onSubmit(): void {
    if (this.addForm.invalid) return;

    const {title, imageUrl} = this.addForm.value;

    // Generate a clean, consistent ID
    const cleanTitle = title.trim();
    const id = this.generateThemeId(cleanTitle);

    // Check if theme with this ID already exists
    const existingTheme = this.themes.find(t => t.id === id);
    if (existingTheme) {
      console.warn('Theme with this ID already exists:', id);
      alert('Un thème avec ce nom existe déjà. Veuillez choisir un autre nom.');
      return;
    }

    const newTheme: Theme = {
      id: id,
      title: cleanTitle,
      imageUrl: imageUrl.trim(),
    };

    console.log('Creating new theme:', newTheme);

    this.themeService.addTheme(newTheme).subscribe({
      next: (createdTheme) => {
        console.log('Theme created successfully:', createdTheme);

        if (this.retour === 'creation') {
          console.log('Navigating to creation with theme id:', createdTheme.id);
          // Use the returned theme from server to ensure consistency
          this.router.navigate(['/creation'], {
            state: { selectedThemeId: createdTheme.id }
          });
        } else {
          this.loadThemes();
          this.addForm.reset();
        }
      },
      error: (error) => {
        console.error('Error creating theme:', error);
        alert('Erreur lors de la création du thème. Veuillez réessayer.');
      }
    });
  }

  /**
   * Generate a consistent theme ID from title
   */
  private generateThemeId(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  onDeleteTheme(id: string): void {
    this.themeService.deleteTheme(id).subscribe({
      next: () => {
        console.log('Theme deleted successfully:', id);
        this.loadThemes();
      },
      error: (error) => {
        console.error('Error deleting theme:', error);
        alert('Erreur lors de la suppression du thème.');
      }
    });
  }

  private loadThemes(): void {
    this.themeService.getThemes().subscribe({
      next: (themes) => {
        console.log('Themes loaded:', themes);
        this.themes = themes;
      },
      error: (error) => {
        console.error('Error loading themes:', error);
        this.themes = [];
      }
    });
  }
}
