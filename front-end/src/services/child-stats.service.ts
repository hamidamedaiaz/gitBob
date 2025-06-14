import {Injectable} from '@angular/core';
import {Child} from 'src/models/child.model';
import {QuizStats} from 'src/models/quiz-stats.model';
import {Observation} from 'src/models/observation.model';
import {Stats} from 'src/models/stats.model';
import {childStatsMock, quizStatsDetailMock} from 'src/mocks/child-stats.mock';
import {QuizStatsDetail} from "../models/quiz-stats-detail.model";

@Injectable({
  providedIn: 'root'
})
export class ChildStatsService {
  private childData: Child = childStatsMock.child;
  private quizzesData: QuizStats[] = childStatsMock.quizzes;
  private observationsData: Observation[] = childStatsMock.observations;
  private generalStatsData: Stats = childStatsMock.generalStats;

  getChildInfo(): Child {
    return this.childData;
  }

  getQuizzes(): QuizStats[] {
    return this.quizzesData;
  }

  getObservations(): Observation[] {
    return this.observationsData;
  }

  addObservation(obs: Observation): void {
    obs.id = new Date().getTime();
    this.observationsData.push(obs);
  }

  deleteObservation(obsId: number): void {
    this.observationsData = this.observationsData.filter(o => o.id !== obsId);
  }

  getGeneralStats(): Stats {
    return this.generalStatsData;
  }

  getQuizStatsDetail(quizId: number): QuizStatsDetail {
    return quizStatsDetailMock;
  }

  getChildren(): Child[] {
    return childStatsMock.children;
  }
}
