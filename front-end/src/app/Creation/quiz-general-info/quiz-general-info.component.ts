import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {ThemeSelectorComponent} from "../theme-selector/theme-selector.component";

@Component({
  selector: 'app-quiz-general-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ThemeSelectorComponent],
  templateUrl: './quiz-general-info.component.html',
  styleUrls: ['./quiz-general-info.component.scss']
})
export class QuizGeneralInfoComponent implements OnInit {
  @Input() generalInfoForm!: FormGroup;

  // ✅ CORRECTION : Ajouter une validation pour s'assurer que le form existe
  ngOnInit(): void {
    if (!this.generalInfoForm) {
      console.error('GeneralInfoForm not provided to QuizGeneralInfoComponent');
    } else {
      console.log('QuizGeneralInfoComponent initialized with form:', this.generalInfoForm.value);
    }
  }
}