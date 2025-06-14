import {Injectable} from '@angular/core';
import {QUIZ_LIST} from "../mocks/quiz-list.mock";
import {Quiz} from "../models/quiz.model";
import {BehaviorSubject, map, Observable} from "rxjs";
import {QuizConfig} from "../models/quiz-config.model";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  public selectedQuiz$ = new BehaviorSubject<Quiz | null>(null);
  private quizzes: Quiz[] = QUIZ_LIST;
  public quizzes$: BehaviorSubject<Quiz[]> = new BehaviorSubject(this.quizzes);

  constructor() {

  }

  updateQuiz(updatedQuiz: Quiz): void {
    const index = this.quizzes.findIndex(q => q.id === updatedQuiz.id);
    if (index !== -1) {
      this.quizzes[index] = updatedQuiz;
      this.quizzes$.next([...this.quizzes]);
    }
  }

  setSelectedQuiz(quiz: Quiz) {
    this.selectedQuiz$.next(quiz);
  }

  /**
   * Ajout d'un quiz et émission de la nouvelle liste de quizzes
   **/

  addQuiz(quiz: Quiz): void {
    this.quizzes.push(quiz);
    // On émet une nouvelle copie de la liste pour notifier les changements
    this.quizzes$.next([...this.quizzes]);

  }

  /**
   * Suppression d'un quiz et émission de la nouvelle liste de quizzes
   */
  deleteQuiz(quiz: Quiz): void {
    // On filtre en supprimant le quiz qui correspond à l'id du quiz passé en paramètre
    this.quizzes = this.quizzes.filter(q => q.id !== quiz.id);
    this.quizzes$.next([...this.quizzes]);
  }

  getQuiz(id: number): Observable<Quiz | undefined> {
    return this.quizzes$.pipe(
      map((quizzes: Quiz[]) => quizzes.find(
          (quiz: Quiz) => quiz.id === id
        )
      )
    );
  }

  getQuizConfig(id: number): QuizConfig | undefined {
    const quiz = this.quizzes.find(q => q.id === id);
    return quiz ? quiz.config : undefined;
  }

  setQuizConfig(quizConfig: QuizConfig): void {
    const currentQuiz = this.selectedQuiz$.value;
    if (currentQuiz) {
      const updatedQuiz = {...currentQuiz, config: quizConfig};
      this.updateQuiz(updatedQuiz);
      this.selectedQuiz$.next(updatedQuiz);
    }
  }


  getQuizzes(): Quiz[] {
    return this.quizzes;
  }
}
