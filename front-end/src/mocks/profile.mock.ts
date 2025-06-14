// src/mocks/profile.mock.ts
import {Profile} from '../models/profile.model';

export const PROFILES: Profile[] = [
  {
    id: 1,
    firstName: 'Thomas',
    lastName: 'Dupont',
    age: 10,
    photoUrl: 'assets/p2.jpg',
    registrationDate: new Date('2024-01-15'),
    quizzesDone: 5,
    specialNeeds: 'Dyslexie légère',
    diagnosisNotes: 'Difficultés de lecture sur mots longs',
    therapyGoals: 'Améliorer la fluidité de lecture',
    favoriteQuizIds: [1, 3, 5]
  },
  {
    id: 2,
    firstName: 'Emma',
    lastName: 'Martin',
    age: 8,
    photoUrl: 'assets/p3.jpg',
    registrationDate: new Date('2024-02-03'),
    quizzesDone: 3,
    specialNeeds: 'Aucun',
    diagnosisNotes: '',
    therapyGoals: '',
    favoriteQuizIds: [2, 4]
  },
  {
    id: 3,
    firstName: 'Lucas',
    lastName: 'Bernard',
    age: 7,
    photoUrl: 'assets/p4.jpg',
    registrationDate: new Date('2024-01-28'),
    quizzesDone: 7,
    specialNeeds: 'TDAH',
    diagnosisNotes: 'Inattention en classe',
    therapyGoals: 'Renforcer la concentration',
    favoriteQuizIds: [1, 2, 3, 4]
  },
  {
    id: 4,
    firstName: 'Léa',
    lastName: 'Petit',
    age: 9,
    photoUrl: 'assets/p5.jpg',
    registrationDate: new Date('2024-03-05'),
    quizzesDone: 2,
    specialNeeds: 'Dyspraxie',
    diagnosisNotes: 'Coordination motrice à travailler',
    therapyGoals: 'Améliorer la motricité fine',
    favoriteQuizIds: []
  },
  {
    id: 5,
    firstName: 'Nathan',
    lastName: 'Rousseau',
    age: 6,
    photoUrl: 'assets/p6.jpg',
    registrationDate: new Date('2024-02-18'),
    quizzesDone: 4,
    specialNeeds: 'Aucun',
    diagnosisNotes: '',
    therapyGoals: '',
    favoriteQuizIds: [5]
  }
];
