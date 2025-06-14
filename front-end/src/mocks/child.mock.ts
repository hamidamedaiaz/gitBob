import {Child} from "../models/child.model";
import {OBSERVATIONS_MOCK} from "./observations.mock";

export const CHILD_MOCK: Child[] = [
  {
    id: 1,
    firstName: 'Alice',
    lastName: 'Martin',
    age: 10,
    registrationDate: new Date('2022-09-01'),
    totalQuizzes: 3,
    bilanErgotherapie: "Amélioration de la coordination motrice",
    photo: 'https://example.com/photos/alice.jpg',
    observations: OBSERVATIONS_MOCK,
  },
  {
    id: 2,
    firstName: 'Bob',
    lastName: 'Durand',
    age: 11,
    registrationDate: new Date('2021-08-20'),
    totalQuizzes: 5,
    bilanErgotherapie: "Bilan satisfaisant avec quelques axes d'amélioration.",
    photo: 'https://example.com/photos/bob.jpg',
    observations: OBSERVATIONS_MOCK,
  }
];
