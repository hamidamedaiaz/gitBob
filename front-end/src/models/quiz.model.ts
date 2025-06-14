import {QuizConfig} from "./quiz-config.model";
import {Question} from "./question.model";

export interface Quiz {
  id: number;
  name: string;
  theme?: string;
  config: QuizConfig;
  questions?: Question[];
}
