import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../../models/quiz.model';
import { Theme } from '../../../models/theme.model';
import { ThemeService } from '../../../services/theme.service';
import { QuizBuilderService } from '../../../services/quiz-builder.service';
import { GameService } from '../../../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quizzes-by-theme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizzes-by-theme.component.html',
  styleUrls: ['./quizzes-by-theme.component.scss']
})
export class QuizzesByThemeComponent implements OnInit {
  themeId: string | null = null;
  theme: Theme | undefined;
  quizzes: Quiz[] = [];
  loading: boolean = true;
  backgroundImageUrl: string = 'assets/homeBackground.jpg';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private quizBuilderService: QuizBuilderService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.themeId = params.get('themeId');
      if (this.themeId) {
        this.loadThemeAndQuizzes(this.themeId);
      } else {
        this.router.navigate(['/themes']);
      }
    });
  }

  loadThemeAndQuizzes(themeId: string): void {
    this.loading = true;

    this.themeService.getThemeById(themeId).subscribe({
      next: theme => this.theme = theme,
      error: err => console.error('Erreur de thème :', err)
    });

    this.quizBuilderService.getQuizzes().subscribe({
      next: allQuizzes => {
        this.quizzes = allQuizzes.filter(quiz => quiz.theme === themeId);
        this.loading = false;
      },
      error: err => {
        console.error('Erreur chargement quiz :', err);
        this.loading = false;
      }
    });
  }

  selectQuiz(quiz: Quiz): void {
    this.gameService.loadQuiz(quiz);
    this.router.navigate(['/play-game']);
  }

  goBack(): void {
    this.router.navigate(['/themes']);
  }
}
