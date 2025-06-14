import {Component, forwardRef, OnInit, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ThemeService} from '../../../services/theme.service';
import {Theme} from '../../../models/theme.model';
import {CommonModule} from '@angular/common';
import {Router, NavigationEnd} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil, filter} from 'rxjs/operators';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThemeSelectorComponent),
      multi: true
    }
  ]
})
export class ThemeSelectorComponent implements ControlValueAccessor, OnInit, OnDestroy {
  value: string = '';
  themes: Theme[] = [];
  selectedTheme?: Theme;
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService, private router: Router) {
  }

  onChange: (value: any) => void = () => {
  };

  onTouched: () => void = () => {
  };

  ngOnInit(): void {
    this.reloadThemes();

    // Listen for navigation events to reload themes when returning from theme management
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      // If we're returning to the creation page, reload themes
      if (event.url.includes('/creation')) {
        console.log('Returned to creation page, reloading themes');
        this.reloadThemes();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  reloadThemes(): void {
    console.log('Reloading themes in theme selector');
    this.themeService.getThemes().subscribe({
      next: (themes) => {
        console.log('Themes reloaded:', themes);
        this.themes = themes;

        // If we have a current value, make sure it's still valid
        if (this.value) {
          const foundTheme = this.themes.find(t => t.id === this.value);
          if (foundTheme) {
            this.selectedTheme = foundTheme;
            console.log('Current theme validated:', foundTheme.title);
          } else {
            console.warn('Current theme not found after reload, clearing selection');
            this.clearSelection();
          }
        }
      },
      error: (error) => {
        console.error('Error reloading themes:', error);
        this.themes = [];
      }
    });
  }

  writeValue(value: string): void {
    console.log('Theme selector writeValue called with:', value);
    if (value !== undefined && value !== this.value) {
      this.value = value;
      this.selectedTheme = this.themes.find(t => t.id === value);
      console.log('Theme selector value set to:', value, 'Theme:', this.selectedTheme?.title);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    console.log('Theme selector change event:', selectedValue);

    if (selectedValue === 'creer_autre_theme') {
      // Don't change the actual value, just navigate
      selectElement.value = this.value; // Reset the select to current value

      console.log("Redirection vers la création de thème depuis ThemeSelectorComponent.");
      this.router.navigate(['/themes-management'], {
        state: {retour: 'creation'}
      });
      return;
    }

    // Update the value and notify parent
    this.value = selectedValue;
    this.selectedTheme = this.themes.find(t => t.id === selectedValue);

    console.log('Theme selected:', selectedValue, this.selectedTheme?.title);

    // Notify the form control
    this.onChange(this.value);
    this.onTouched();
  }

  private clearSelection(): void {
    this.value = '';
    this.selectedTheme = undefined;
    this.onChange(this.value);
  }

  // TrackBy function for better performance
  trackByThemeId(index: number, theme: Theme): string {
    return theme.id;
  }
}
