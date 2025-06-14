import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Profile} from '../models/profile.model';
import {PROFILES} from '../mocks/profile.mock';
import {Quiz} from '../models/quiz.model';
import {QuizService} from './quiz.service';

export interface ProfileExtended extends Profile {
  favoriteQuizIds?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfileManagementService {
  private profiles: ProfileExtended[] = PROFILES.map(profile => ({
    ...profile,
    favoriteQuizIds: []
  }));

  private profilesSubject = new BehaviorSubject<ProfileExtended[]>(this.profiles);
  profiles$ = this.profilesSubject.asObservable();

  private selectedProfileSubject = new BehaviorSubject<ProfileExtended | null>(null);
  selectedProfile$ = this.selectedProfileSubject.asObservable();

  constructor(private quizService: QuizService) {
    this.initializeFavoriteQuizzes();
  }

  getProfiles(): Observable<ProfileExtended[]> {
    return this.profilesSubject.asObservable();
  }

  getProfile(id: number): Observable<ProfileExtended | undefined> {
    const profile = this.profiles.find(p => p.id === id);
    return of(profile);
  }

  selectProfile(id: number): void {
    const profile = this.profiles.find(p => p.id === id);
    this.selectedProfileSubject.next(profile || null);
  }

  createProfile(profile: ProfileExtended): void {
    const newId = Math.max(...this.profiles.map(p => p.id), 0) + 1;

    const newProfile: ProfileExtended = {
      ...profile,
      id: newId,
      favoriteQuizIds: profile.favoriteQuizIds || [],
      registrationDate: profile.registrationDate || new Date(),
      quizzesDone: profile.quizzesDone || 0
    };

    this.profiles.push(newProfile);
    this.profilesSubject.next([...this.profiles]);
  }

  updateProfile(profile: ProfileExtended): void {
    const index = this.profiles.findIndex(p => p.id === profile.id);

    if (index !== -1) {
      this.profiles[index] = {...profile};
      this.profilesSubject.next([...this.profiles]);

      const selectedProfile = this.selectedProfileSubject.value;
      if (selectedProfile && selectedProfile.id === profile.id) {
        this.selectedProfileSubject.next({...profile});
      }
    }
  }

  deleteProfile(id: number): void {
    this.profiles = this.profiles.filter(p => p.id !== id);
    this.profilesSubject.next([...this.profiles]);


    const selectedProfile = this.selectedProfileSubject.value;
    if (selectedProfile && selectedProfile.id === id) {
      this.selectedProfileSubject.next(null);
    }
  }

  addFavoriteQuiz(profileId: number, quizId: number): void {
    const profile = this.profiles.find(p => p.id === profileId);

    if (profile) {
      if (!profile.favoriteQuizIds) {
        profile.favoriteQuizIds = [];
      }

      if (!profile.favoriteQuizIds.includes(quizId)) {
        profile.favoriteQuizIds.push(quizId);
        this.updateProfile(profile);
      }
    }
  }

  removeFavoriteQuiz(profileId: number, quizId: number): void {
    const profile = this.profiles.find(p => p.id === profileId);

    if (profile && profile.favoriteQuizIds) {
      profile.favoriteQuizIds = profile.favoriteQuizIds.filter(id => id !== quizId);
      this.updateProfile(profile);
    }
  }

  getFavoriteQuizzes(profileId: number): Observable<Quiz[]> {
    const profile = this.profiles.find(p => p.id === profileId);

    if (profile && profile.favoriteQuizIds && profile.favoriteQuizIds.length > 0) {
      const allQuizzes = this.quizService.getQuizzes();
      const favoriteQuizzes = allQuizzes.filter(quiz =>
        profile.favoriteQuizIds!.includes(quiz.id)
      );

      return of(favoriteQuizzes);
    }

    return of([]);
  }

  searchProfiles(term: string): Observable<ProfileExtended[]> {
    if (!term.trim()) {
      return of(this.profiles);
    }

    term = term.toLowerCase();
    const filteredProfiles = this.profiles.filter(profile =>
      profile.firstName.toLowerCase().includes(term) ||
      profile.lastName.toLowerCase().includes(term)
    );

    return of(filteredProfiles);
  }

  private initializeFavoriteQuizzes(): void {
    const quizzes = this.quizService.getQuizzes();

    if (quizzes && quizzes.length > 0) {
      this.profiles.forEach(profile => {
        const numFavorites = Math.floor(Math.random() * 3) + 1;
        const favoriteIds: number[] = [];

        for (let i = 0; i < numFavorites; i++) {
          const randomIndex = Math.floor(Math.random() * quizzes.length);
          const quizId = quizzes[randomIndex].id;

          if (!favoriteIds.includes(quizId)) {
            favoriteIds.push(quizId);
          }
        }

        profile.favoriteQuizIds = favoriteIds;
      });

      this.profilesSubject.next([...this.profiles]);
    }
  }
}
