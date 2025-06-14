// front-end/src/app/Management/quizzes-management/quizzes-management.component.ts
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {Quiz} from '../../../models/quiz.model';
import {QuizService} from '../../../services/quiz.service';
import {QuizComponent} from './quiz/quiz.component';
import {QuizBuilderService} from "../../../services/quiz-builder.service";

@Component({
  selector: 'app-quizzes-management',
  standalone: true,
  imports: [CommonModule, FormsModule, QuizComponent],
  templateUrl: './quizzes-management.component.html',
  styleUrls: ['./quizzes-management.component.scss']
})
export class QuizzesManagementComponent implements OnInit {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];

  searchQuery = '';
  selectedFilter: 'alpha' | 'size' = 'alpha';

  showConfirmDelete = false;
  quizToDelete: Quiz | null = null;

  showDeletedToast = false;
  isLoading = true;
  error: string | null = null;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private quizBuilderService: QuizBuilderService
  ) {
  }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  private loadQuizzes(): void {
    this.isLoading = true;
    this.error = null;

    // Subscribe to the backend API to get quizzes
    this.quizBuilderService.getQuizzes().subscribe({
      next: (quizzes) => {
        console.log('Loaded quizzes from backend:', quizzes);
        this.quizzes = quizzes;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading quizzes:', err);
        this.error = 'Erreur lors du chargement des quiz. Veuillez réessayer.';
        this.quizzes = [];
        this.filteredQuizzes = [];
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    let list = [...this.quizzes];

    if (this.searchQuery.trim()) {
      const term = this.searchQuery.toLowerCase();
      list = list.filter(q =>
        q.name.toLowerCase().includes(term) ||
        (q.theme ?? '').toLowerCase().includes(term)
      );
    }

    if (this.selectedFilter === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.selectedFilter === 'size') {
      // Sort by number of questions (if available) or by name as fallback
      list.sort((a, b) => {
        const aQuestions = a.questions?.length || 0;
        const bQuestions = b.questions?.length || 0;
        return bQuestions - aQuestions;
      });
    }

    this.filteredQuizzes = list;
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  createQuiz(): void {
    this.router.navigate(['/creation']);
  }

 editQuiz(quiz: Quiz): void {
  console.log('Navigating to edit quiz:', quiz.id);
  this.router.navigate(['/edit-quiz', quiz.id]);
}

  selectQuiz(quiz: Quiz): void {
    this.router.navigate(['/profile-selection'], {queryParams: {quizId: quiz.id}});
  }

  onDeleteClick(quiz: Quiz): void {
    this.quizToDelete = quiz;
    this.showConfirmDelete = true;
  }

  confirmDelete(): void {
    if (this.quizToDelete) {
      this.quizBuilderService.deleteQuiz(this.quizToDelete.id.toString()).subscribe({
        next: () => {
          console.log('Quiz deleted successfully');
          this.loadQuizzes(); // Reload the list
          this.showDeletedToast = true;
          setTimeout(() => this.showDeletedToast = false, 2500);
        },
        error: (err) => {
          console.error('Error deleting quiz:', err);
          alert('Erreur lors de la suppression du quiz');
        }
      });
    }
    this.showConfirmDelete = false;
    this.quizToDelete = null;
  }

  cancelDelete(): void {
    this.showConfirmDelete = false;
    this.quizToDelete = null;
  }
  getThemeDisplayName(theme: string | undefined): string {
    if (!theme) return 'Sans thème';

    return theme;
  }

  getQuizInfo(quiz: Quiz): string {
    const questions = quiz.questions?.length || 0;
    const questionText = questions === 1 ? 'question' : 'questions';
    return `${questions} ${questionText}`;
  }

}
