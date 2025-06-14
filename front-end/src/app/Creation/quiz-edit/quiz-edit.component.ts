// front-end/src/app/Creation/quiz-edit/quiz-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, filter, take } from 'rxjs/operators';

import { QuizBuilderService } from '../../../services/quiz-builder.service';
import { ThemeService } from '../../../services/theme.service';
import { Theme } from '../../../models/theme.model';
import { QuizConfig } from '../../../models/quiz-config.model';
import { Quiz } from '../../../models/quiz.model';
import { Question } from '../../../models/question.model';

import { QuizProgressBarComponent } from '../quiz-progress-bar/quiz-progress-bar.component';
import { QuizGeneralInfoComponent } from '../quiz-general-info/quiz-general-info.component';
import { QuizQuestionEditorComponent } from '../quiz-question-editor/quiz-question-editor.component';
import { QuizFinalizationComponent } from '../quiz-finalization/quiz-finalization.component';
import { QuizFooterNavigationComponent } from '../quiz-footer-navigation/quiz-footer-navigation.component';

@Component({
  selector: 'app-quiz-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    QuizProgressBarComponent,
    QuizGeneralInfoComponent,
    QuizQuestionEditorComponent,
    QuizFinalizationComponent,
    QuizFooterNavigationComponent
  ],
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.scss']
})
export class QuizEditComponent implements OnInit {
  generalInfoForm!: FormGroup;
  currentStep = 1;
  themes: Theme[] = [];
  questions: Question[] = [];
  configData: Partial<QuizConfig> = {};
  themesLoaded = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Quiz editing specific properties
  quizId: string = '';
  originalQuiz: Quiz | null = null;
  isEditMode = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private quizBuilderService: QuizBuilderService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Get quiz ID from route params
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.quizId) {
      console.error('No quiz ID provided');
      this.router.navigate(['/management/quizzes-management']);
      return;
    }

    // Initialize form
    this.generalInfoForm = this.fb.group({
      name: ['', Validators.required],
      theme: ['', Validators.required],
      numberOfQuestions: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    // Load themes and quiz data
    this.loadThemesAndInitialize();
    this.setupFormSubscriptions();
    this.setupConfigSubscription();
    this.setupRouteSubscription();
  }

  private loadThemesAndInitialize(): void {
    this.themeService.getThemes().pipe(take(1)).subscribe({
      next: (themes: Theme[]) => {
        console.log('Themes loaded for quiz edit:', themes);
        this.themes = themes;
        this.themesLoaded = true;
        
        // ✅ CORRECTION : Utiliser la nouvelle fonction loadQuizForEdit
        this.loadQuizData();
      },
      error: (error) => {
        console.error('Error loading themes:', error);
        this.themes = [];
        this.themesLoaded = true;
      }
    });
  }

  // ✅ CORRECTION : Nouvelle méthode pour charger les données du quiz
  private loadQuizData(): void {
    this.isLoading = true;
    
    // Utiliser la nouvelle fonction loadQuizForEdit du service
    this.quizBuilderService.loadQuizForEdit(this.quizId).subscribe({
      next: () => {
        console.log('Quiz data loaded for editing');
        
        // ✅ S'abonner aux données une fois qu'elles sont chargées
        this.subscribeToQuizData();
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading quiz for edit:', error);
        this.errorMessage = 'Erreur lors du chargement du quiz';
        this.isLoading = false;
      }
    });
  }

  // ✅ CORRECTION : S'abonner aux données du service après le chargement
  private subscribeToQuizData(): void {
    // S'abonner aux données de création
    this.quizBuilderService.creationData$.pipe(take(1)).subscribe(creationData => {
      if (creationData.name) {
        console.log('Populating form with loaded data:', creationData);
        
        this.generalInfoForm.patchValue({
          name: creationData.name,
          theme: creationData.theme,
          numberOfQuestions: creationData.questions?.length || 1
        });

        // ✅ Assigner les questions chargées
        if (creationData.questions && creationData.questions.length > 0) {
          this.questions = [...creationData.questions];
          console.log('Questions assigned for editing:', this.questions);
        } else {
          // Fallback si pas de questions
          this.questions = [this.createQuestion()];
        }
      }
    });

    // S'abonner aux données de configuration
    this.quizBuilderService.configData$.pipe(take(1)).subscribe(configData => {
      if (configData) {
        this.configData = { ...configData };
        console.log('Config data loaded:', this.configData);
      }
    });
  }

  private setupFormSubscriptions(): void {
    this.generalInfoForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(v => {
        this.quizBuilderService.setCreationData({
          name: v.name,
          theme: v.theme,
          questions: this.questions
        });
      });

    this.generalInfoForm.controls['numberOfQuestions'].valueChanges
      .subscribe(count => this.updateQuestionsArray(count));
  }

  private setupConfigSubscription(): void {
    this.quizBuilderService.configData$
      .pipe(debounceTime(0))
      .subscribe(cfg => this.configData = cfg);
  }

  private setupRouteSubscription(): void {
    this.route.queryParamMap.subscribe(params => {
      const step = Number(params.get('step'));
      if ([1, 2, 3].includes(step)) {
        this.currentStep = step;
      }
    });
  }

  createQuestion(): Question {
    return {
      id: 0,
      type: 'action-objet',
      pairsCount: 1,
      pairs: [this.createEmptyPair()],
    };
  }

  createEmptyPair() {
    return {
      description: '',
      sourceImage: { file: new File([], ''), preview: '' },
      targetImage: { file: new File([], ''), preview: '' }
    };
  }

  updateQuestionsArray(count: number): void {
    const len = this.questions.length;
    if (count > len) {
      for (let i = len; i < count; i++) {
        this.questions.push(this.createQuestion());
      }
    } else if (count < len) {
      this.questions.splice(count, len - count);
    }
  }

  canProceedToNextStep(): boolean {
    return this.currentStep === 1 ? this.generalInfoForm.valid : true;
  }

  nextStep(): void {
    if (this.canProceedToNextStep()) {
      this.currentStep++;
      this.saveCurrentData();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.saveCurrentData();
    }
  }

  saveCurrentData(): void {
    const { name, theme } = this.generalInfoForm.value;
    this.quizBuilderService.setCreationData({
      name, theme, questions: this.questions
    });
  }

  navigateToAdvancedConfig(): void {
    this.saveCurrentData();
    this.router.navigate(['/quiz-configuration/config-container'], {
      queryParams: { mode: 'edit', quizId: this.quizId }
    });
  }

  updateQuiz(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.saveCurrentData();

    // ✅ Utiliser getFinalQuizForUpdate au lieu de getFinalQuizSync
    const finalQuiz = this.quizBuilderService.getFinalQuizForUpdate();

    if (!finalQuiz.name || !finalQuiz.theme) {
      this.errorMessage = 'Veuillez remplir le nom et le thème du quiz';
      return;
    }

    if (!finalQuiz.questions || finalQuiz.questions.length === 0) {
      this.errorMessage = 'Veuillez ajouter au moins une question';
      return;
    }

    this.isLoading = true;
    console.log('Updating quiz with ID:', this.quizId, finalQuiz);

    this.quizBuilderService.updateQuiz(this.quizId, finalQuiz).subscribe({
      next: (response) => {
        console.log('Quiz updated successfully:', response);
        this.isLoading = false;
        this.successMessage = 'Quiz modifié avec succès!';

        setTimeout(() => {
          this.quizBuilderService.reset();
          this.router.navigate(['/management/quizzes-management']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Erreur lors de la modification du quiz :", err);

        if (err.status === 400) {
          this.errorMessage = 'Erreur de validation : Veuillez vérifier que tous les champs requis sont remplis correctement.';
        } else if (err.status === 404) {
          this.errorMessage = 'Quiz non trouvé.';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la modification du quiz.';
        }
      }
    });
  }

  cancelEdit(): void {
    this.quizBuilderService.reset();
    this.router.navigate(['/management/quizzes-management']);
  }

  getThemeName(id: string): string {
    if (!id || id.trim() === '') {
      return 'Aucun thème sélectionné';
    }

    if (!this.themesLoaded) {
      return 'Chargement des thèmes...';
    }

    if (!this.themes || this.themes.length === 0) {
      return 'Aucun thème disponible';
    }

    let theme = this.themes.find(t => t.id === id);

    if (!theme && /^\d+$/.test(id)) {
      theme = this.themes.find(t => String(t.id) === String(id));
    }

    if (theme) {
      return theme.title;
    } else {
      if (this.themes.length > 0) {
        return `${this.themes[0].title} (thème par défaut)`;
      }
      return `Thème introuvable (${id})`;
    }
  }
}