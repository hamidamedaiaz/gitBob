import {Component, Input} from '@angular/core';
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
export class QuizGeneralInfoComponent {
  @Input() generalInfoForm!: FormGroup;
}
