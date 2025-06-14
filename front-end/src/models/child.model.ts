import {Observation} from './observation.model';

export interface Child {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  registrationDate: Date;
  totalQuizzes: number;
  bilanErgotherapie: string;
  photo: string;
  observations: Observation[];
}
