import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Profile} from '../../../../models/profile.model';
import {ProfileService} from '../../../../services/profile.service';


@Component({
  selector: 'app-profile-create',
  templateUrl: './profile-create.component.html',
  styleUrls: ['./profile-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProfileCreateComponent {
  profileForm: FormGroup;

  @Output() profileCreated = new EventEmitter<Profile>();
  @Output() cancelCreate = new EventEmitter<void>();


  avatarOptions = [
    {url: 'assets/p1.jpg', label: 'Avatar 1'},
    {url: 'assets/p2.jpg', label: 'Avatar 2'},
    {url: 'assets/p3.jpg', label: 'Avatar 3'},
    {url: 'assets/p4.jpg', label: 'Avatar 4'},
    {url: 'assets/p5.jpg', label: 'Default'},
    {url: 'assets/p6.jpg', label: 'Default'}
  ];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.profileForm = this.createProfileForm();
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      age: [null, [Validators.required, Validators.min(1), Validators.max(120)]],
      photoUrl: ['assets/default-profile.jpg'],
      specialNeeds: [''],
      diagnosisNotes: [''],
      therapyGoals: ['']
    });
  }

  selectAvatar(url: string): void {
    this.profileForm.get('photoUrl')?.setValue(url);
  }

  isSelectedAvatar(url: string): boolean {
    return this.profileForm.get('photoUrl')?.value === url;
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


    const newProfile: Profile = {
      ...formData,
      id: 0,
      registrationDate: new Date(),
      quizzesDone: 0
    };


    this.profileService.createProfile(newProfile).subscribe({
      next: (createdProfile) => {
        this.profileCreated.emit(createdProfile);
        this.profileForm.reset({photoUrl: 'assets/default-profile.jpg'});
      },
      error: (err) => {
        console.error('Erreur lors de la création du profil:', err);
      }

    });
  }


  cancel(): void {
    this.cancelCreate.emit();
  }
}
