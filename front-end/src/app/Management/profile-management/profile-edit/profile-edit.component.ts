import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProfileExtended} from '../../../../models/profile-extended.model';
import {ProfileService} from '../../../../services/profile.service';
import {QuizService} from '../../../../services/quiz.service';
import {Quiz} from '../../../../models/quiz.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProfileEditComponent implements OnInit {
  @Input() profile!: ProfileExtended;
  @Output() profileUpdated = new EventEmitter<ProfileExtended>();
  @Output() cancelEdit = new EventEmitter<void>();

  profileForm: FormGroup;
  availableQuizzes: Quiz[] = [];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private quizService: QuizService
  ) {
    this.profileForm = this.createProfileForm();
  }

  ngOnInit(): void {
    this.loadQuizzes();
    this.populateForm();
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
      specialNeeds: [''],
      diagnosisNotes: [''],
      therapyGoals: [''],
      favoriteQuizIds: [[]]
    });
  }

  loadQuizzes(): void {
    this.availableQuizzes = this.quizService.getQuizzes();
  }

  populateForm(): void {
    if (this.profile) {
      this.profileForm.patchValue({
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        age: this.profile.age,
        specialNeeds: this.profile.specialNeeds || '',
        diagnosisNotes: this.profile.diagnosisNotes || '',
        therapyGoals: this.profile.therapyGoals || '',
        favoriteQuizIds: this.profile.favoriteQuizIds || []
      });
    }
  }

  toggleFavoriteQuiz(quizId: number): void {
    const favoriteQuizIds = [...(this.profileForm.get('favoriteQuizIds')?.value || [])];

    if (favoriteQuizIds.includes(quizId)) {

      const updatedFavorites = favoriteQuizIds.filter((id: number) => id !== quizId);
      this.profileForm.get('favoriteQuizIds')?.setValue(updatedFavorites);
    } else {

      this.profileForm.get('favoriteQuizIds')?.setValue([...favoriteQuizIds, quizId]);
    }
  }

  isQuizFavorite(quizId: number): boolean {
    const favoriteQuizIds = this.profileForm.get('favoriteQuizIds')?.value || [];
    return favoriteQuizIds.includes(quizId);
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formData = this.profileForm.value;


    const updatedProfile: ProfileExtended = {
      ...this.profile,
      ...formData
    };
    this.profileService.updateProfile(this.profile.id, updatedProfile).subscribe({
      next: (createdProfile) => {
        this.profileUpdated.emit(createdProfile);
        this.profileForm.reset({photoUrl: 'assets/default-profile.jpg'});
      },
      error: (err) => {
        console.error('Erreur lors de la modif du profil:', err);
      }
    });


  }

  cancel(): void {
    this.cancelEdit.emit();
  }
}
