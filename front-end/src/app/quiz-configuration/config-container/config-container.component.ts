import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {CommonModule} from '@angular/common';
import {QuizBuilderService} from '../../../services/quiz-builder.service';
import {FormInputComponent} from '../components/form-input/form-input.component';
import {SliderComponent} from '../components/slider/slider.component';
import {YesOrNoInputComponent} from '../components/yes-or-no-input/yes-or-no-input.component';
import {BackgroundSelectorComponent} from '../components/background-selector/background-selector.component';
import {HintFormComponent} from '../components/hint-form/hint-form.component';

@Component({
  selector: 'app-config-container',
  standalone: true,
  imports: [
    FormInputComponent,
    SliderComponent,
    YesOrNoInputComponent,
    BackgroundSelectorComponent,
    HintFormComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './config-container.component.html',
  styleUrls: ['./config-container.component.scss'],
})
export class ConfigContainerComponent implements OnInit {
  configForm!: FormGroup;
  
  // Propriétés pour le mode édition
  isEditMode: boolean = false;
  quizId: string | null = null;

  constructor(
    private quizBuilderService: QuizBuilderService,
    private router: Router,
    private route: ActivatedRoute // Ajout d'ActivatedRoute
  ) {
  }

  /** Getter fort typé pour le sous-FormGroup hint */
  get hint(): FormGroup {
    return this.configForm.get('hint') as FormGroup;
  }

  ngOnInit(): void {
    
    // Vérifier si nous sommes en mode édition
    this.route.queryParams.subscribe(params => {
      this.isEditMode = params['mode'] === 'edit';
      this.quizId = params['quizId'] || '';
    
      console.log('Config Container - Edit Mode:', this.isEditMode);
      console.log('Config Container - Quiz ID:', this.quizId);
    });
    
    this.configForm = new FormGroup({
      feedbackEchec: new FormControl('', Validators.required),
      feedbackSucces: new FormControl('', Validators.required),
      chronometre: new FormControl(false, Validators.required),
      ordreAleatoire: new FormControl(false, Validators.required),
      typeIndice: new FormControl(false, Validators.required),
      taillePolice: new FormControl(16, Validators.required),
      tailleImage: new FormControl(35, Validators.required),
      luminosite: new FormControl(50, Validators.required),
      background: new FormControl({type: 'color', value: '#3498db'}, Validators.required),
      hint: new FormGroup({
        hintType: new FormControl(''),
        text: new FormControl(''),
        image: new FormControl(null),
        audio: new FormControl(null),
        video: new FormControl(null),
      })
    });

    this.quizBuilderService.configData$
      .pipe(debounceTime(0))
      .subscribe(saved => {
        if (saved) {
          this.configForm.patchValue(saved, {emitEvent: false});
        }
      });

    this.configForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(cfg => this.quizBuilderService.setConfigData(cfg as any));
  }

  saveConfig(): void {
    if (this.isEditMode && this.quizId) {
      // En mode édition, retourner vers l'éditeur de quiz
      this.router.navigate(['/edit-quiz', this.quizId], {queryParams: {step: 3}});
    } else {
      // En mode création, retourner vers la création
      this.router.navigate(['/creation'], {queryParams: {step: 3}});
    }
  }


  // Méthode pour annuler et revenir
  cancelConfig(): void {
    if (this.isEditMode && this.quizId) {
      this.router.navigate(['/edit-quiz', this.quizId], {
        queryParams: { step: 3 }
      });
    } else {
      this.router.navigate(['/creation'], {
        queryParams: { step: 3 }
      });
    }
  }
}