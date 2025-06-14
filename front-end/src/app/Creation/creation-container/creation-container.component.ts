import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {debounceTime, filter, take, distinctUntilChanged} from 'rxjs/operators';

import {QuizBuilderService} from '../../../services/quiz-builder.service';
import {ThemeService} from '../../../services/theme.service';
import {QuizService} from '../../../services/quiz.service';
import {Theme} from '../../../models/theme.model';
import {QuizConfig} from '../../../models/quiz-config.model';

import {QuizProgressBarComponent} from '../quiz-progress-bar/quiz-progress-bar.component';
import {QuizGeneralInfoComponent} from '../quiz-general-info/quiz-general-info.component';
import {QuizQuestionEditorComponent} from '../quiz-question-editor/quiz-question-editor.component';
import {QuizFinalizationComponent} from '../quiz-finalization/quiz-finalization.component';
import {QuizFooterNavigationComponent} from '../quiz-footer-navigation/quiz-footer-navigation.component';
import {Question} from "../../../models/question.model";
import {Pair} from "../../../models/pair.model";


@Component({
  selector: 'app-creation-container',
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
  templateUrl: './creation-container.component.html',
  styleUrls: ['./creation-container.component.scss']
})
export class CreationContainerComponent implements OnInit {
  generalInfoForm!: FormGroup;
  currentStep = 1;
  themes: Theme[] = [];
  questions: Question[] = [];
  configData: Partial<QuizConfig> = {};
  themesLoaded = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private quizBuilderService: QuizBuilderService,
    private themeService: ThemeService,
    private quizService: QuizService
  ) {
  }

  ngOnInit(): void {
    // ✅ CORRECTION : Initialiser le formulaire avec des valeurs par défaut stables
    this.generalInfoForm = this.fb.group({
      name: ['', Validators.required],
      theme: ['', Validators.required],
      numberOfQuestions: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    // ✅ Désactiver temporairement les événements pendant l'initialisation
    this.generalInfoForm.patchValue({
      name: '',
      theme: '',
      numberOfQuestions: 1
    }, { emitEvent: false });

    // Get navigation state
    const nav = this.router.getCurrentNavigation();
    const selectedThemeId = nav?.extras.state?.['selectedThemeId'];

    console.log('CreationContainer ngOnInit - selectedThemeId from navigation:', selectedThemeId);

    // Load themes FIRST and wait for completion
    this.loadThemesAndInitialize(selectedThemeId);

    // ✅ Set up subscriptions AFTER form initialization
    setTimeout(() => {
      this.setupFormSubscriptions();
      this.setupConfigSubscription();
      this.setupRouteSubscription();
    }, 0);
  }

  private loadThemesAndInitialize(selectedThemeId?: string): void {
    this.themeService.getThemes().pipe(
      take(1) // Only take the first emission
    ).subscribe({
      next: (themes: Theme[]) => {
        console.log('Themes loaded in CreationContainer:', themes);
        console.log('Available theme IDs:', themes.map(t => `${t.id} (${t.title})`));
        this.themes = themes;
        this.themesLoaded = true;

        // Set theme after themes are loaded
        if (selectedThemeId) {
          console.log('Setting theme from navigation:', selectedThemeId, typeof selectedThemeId);
          const foundTheme = this.themes.find(t => t.id === selectedThemeId);
          if (foundTheme) {
            console.log('Found theme, setting form value:', foundTheme.title);
            // ✅ CORRECTION : Utiliser emitEvent: false pour éviter les boucles
            this.generalInfoForm.get('theme')?.setValue(selectedThemeId, { emitEvent: false });
            console.log('Form theme value after set:', this.generalInfoForm.get('theme')?.value);
          } else {
            console.warn('Selected theme not found:', selectedThemeId);
            console.warn('Available themes:', this.themes.map(t => t.id));
          }
        }

        // Initialize other data after themes are loaded
        this.initializeQuizBuilderData();
      },
      error: (error) => {
        console.error('Error loading themes:', error);
        this.themes = [];
        this.themesLoaded = true;
      }
    });
  }

  // ✅ CORRECTION : Utiliser distinctUntilChanged pour éviter les boucles infinies
  private setupFormSubscriptions(): void {
    this.generalInfoForm.valueChanges
      .pipe(
        debounceTime(500), // ✅ Augmenter le délai pour éviter les déclenchements rapides
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(v => {
        // ✅ Ne sauvegarder que si les valeurs ont vraiment changé et sont valides
        if (v && (v.name || v.theme || (v.numberOfQuestions && v.numberOfQuestions > 0))) {
          this.quizBuilderService.setCreationData({
            name: v.name,
            theme: v.theme,
            questions: this.questions
          });
        }
      });

    // ✅ CORRECTION : Éviter les changements non désirés du nombre de questions
    this.generalInfoForm.controls['numberOfQuestions'].valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(count => {
        if (count && count > 0 && count !== this.questions.length) {
          this.updateQuestionsArray(count);
        }
      });
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

  // ✅ CORRECTION : Améliorer la méthode initializeQuizBuilderData
  private initializeQuizBuilderData(): void {
    this.quizBuilderService.creationData$
      .pipe(
        debounceTime(0),
        filter(() => this.themesLoaded),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(saved => {
        if (saved.name && !this.generalInfoForm.get('name')?.value) {
          // ✅ CORRECTION : Utiliser patchValue avec emitEvent: false pour éviter les boucles
          this.generalInfoForm.patchValue({
            name: saved.name,
            theme: saved.theme,
            numberOfQuestions: saved.questions?.length || 1
          }, { emitEvent: false });

          if (saved.questions && this.questions.length === 0) {
            this.questions = saved.questions;
          }
        }

        // ✅ Initialiser les questions seulement si nécessaire
        if (this.questions.length === 0) {
          const count = this.generalInfoForm.controls['numberOfQuestions'].value || 1;
          this.questions = Array.from({length: count}, () => this.createQuestion());
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

  goToCreateThemePage(): void {
    console.log("Navigation vers la gestion des thèmes avec l'état 'retour: creation'");
    this.router.navigate(['/themes-management'], {
      state: {retour: 'creation'}
    });
  }

  createEmptyPair(): Pair {
    return {
      description: '',
      sourceImage: {file: new File([], ''), preview: ''},
      targetImage: {file: new File([], ''), preview: ''}
    };
  }

  // ✅ CORRECTION : Améliorer la gestion des changements de nombre de questions
  updateQuestionsArray(count: number): void {
    if (!count || count < 1) return;
    
    const len = this.questions.length;
    
    // ✅ CORRECTION : Éviter les modifications inutiles
    if (count === len) return;
    
    if (count > len) {
      for (let i = len; i < count; i++) {
        this.questions.push(this.createQuestion());
      }
    } else if (count < len) {
      this.questions.splice(count, len - count);
    }
    
    console.log(`Questions array updated: ${len} -> ${count}`);
  }

  canProceedToNextStep(): boolean {
    return this.currentStep === 1
      ? this.generalInfoForm.valid
      : true;
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
    const {name, theme} = this.generalInfoForm.value;
    this.quizBuilderService.setCreationData({
      name, theme, questions: this.questions
    });
  }

  navigateToAdvancedConfig(): void {
    this.saveCurrentData();
    this.router.navigate(['/quiz-configuration/config-container']);
  }

  saveQuiz(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Save current data
    this.saveCurrentData();

    // Get the final quiz data
    const finalQuiz = this.quizBuilderService.getFinalQuizSync();

    // Validate before sending
    if (!finalQuiz.name || !finalQuiz.theme) {
      this.errorMessage = 'Veuillez remplir le nom et le thème du quiz';
      console.error('Quiz validation failed:', finalQuiz);
      return;
    }

    // Check if at least one question exists
    if (!finalQuiz.questions || finalQuiz.questions.length === 0) {
      this.errorMessage = 'Veuillez ajouter au moins une question';
      return;
    }

    // Show loading state
    this.isLoading = true;

    console.log('Attempting to save quiz:', finalQuiz);

    this.quizBuilderService.createQuiz(finalQuiz).subscribe({
      next: (response) => {
        console.log('Quiz saved successfully:', response);
        this.isLoading = false;
        this.successMessage = 'Quiz créé avec succès!';

        // Reset and navigate after a short delay
        setTimeout(() => {
          this.quizBuilderService.reset();
          this.router.navigate(['/management/quizzes-management']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        console.error("Erreur lors de l'enregistrement du quiz :", err);
        console.error("Error details:", err.error);

        // Show user-friendly error message
        if (err.status === 400) {
          if (err.error && err.error.details) {
            // If backend provides specific validation errors
            this.errorMessage = `Erreur de validation : ${JSON.stringify(err.error.details)}`;
          } else {
            this.errorMessage = 'Erreur de validation : Veuillez vérifier que tous les champs requis sont remplis correctement.';
          }
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la sauvegarde du quiz.';
        }
      }
    });
  }

  // IMPROVED getThemeName function
  getThemeName(id: string): string {
    // Handle empty or invalid ID
    if (!id || id.trim() === '') {
      return 'Aucun thème sélectionné';
    }

    // Check if themes are still loading
    if (!this.themesLoaded) {
      return 'Chargement des thèmes...';
    }

    // Check if themes array is empty
    if (!this.themes || this.themes.length === 0) {
      return 'Aucun thème disponible';
    }

    // Find the theme - try both string and converted string comparison
    let theme = this.themes.find(t => t.id === id);

    // If not found and ID looks like a timestamp, try finding by converted string
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