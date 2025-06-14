import {Observation} from "../models/observation.model";

export const OBSERVATIONS_MOCK: Observation[] = [
  {
    id: 1,
    title: 'Observation Initiale',
    content: 'Première observation concernant l’évolution générale.',
    date: new Date('2023-01-15')
  },
  {
    id: 2,
    title: 'Observation Intermédiaire',
    content: 'Observation sur les progrès réalisés et points à améliorer.',
    date: new Date('2023-03-10')
  },
  {
    id: 3,
    title: 'Observation Finale',
    content: 'Bilan final détaillé incluant les recommandations.',
    date: new Date('2023-06-05')
  }
];
