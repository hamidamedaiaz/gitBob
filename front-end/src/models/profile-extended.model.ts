import {Profile} from './profile.model';

export interface ProfileExtended extends Profile {
  favoriteQuizIds?: number[];
  description?: string;
  specialNeeds?: string;
  diagnosisNotes?: string;
  therapyGoals?: string;
  avatarColor?: string; // For customized profile appearance
}
