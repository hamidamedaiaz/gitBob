import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {ThemeService} from '../../../services/theme.service';
import {Theme} from '../../../models/theme.model';
import {ThemeComponent} from '../theme/theme.component';

@Component({
  selector: 'app-theme-list',
  standalone: true,
  imports: [
    CommonModule,
    ThemeComponent
  ],
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss']
})
export class ThemeListComponent implements OnInit {
  headerText = 'Sélectionner le thème :';
  themes: Theme[] = [];


  borderColors = ['#8B00FF', '#FF6347', '#4169E1', '#32CD32'];

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {
  }

  ngOnInit(): void {
    this.themeService.getThemes().subscribe((themes) => {
      this.themes = themes;
    });
  }

  getBorderColorByIndex(i: number): string {
    return this.borderColors[i % this.borderColors.length];
  }

  onThemeSelected(theme: Theme): void {
    console.log('Theme selected:', theme);
    this.router.navigate(['/theme', theme.id, 'quizzes']);
  }

}
