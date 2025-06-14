export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  photoUrl: string;
  registrationDate: Date;
  quizzesDone: number;
  specialNeeds?: string;

  diagnosisNotes?: string;
  therapyGoals?: string;
  favoriteQuizIds?: number[];
}
