import {Pair} from "./pair.model";

export interface Question {
  id: number;
  type: 'action-objet' | 'succession-taches';
  pairs: Pair[];
  pairsCount: number;
}
