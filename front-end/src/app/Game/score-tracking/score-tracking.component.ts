import {Component, OnInit} from '@angular/core';
import {GameService} from '../../../services/game.service';

@Component({
  selector: 'app-score-tracking',
  templateUrl: './score-tracking.component.html',
  styleUrls: ['./score-tracking.component.scss']
})
export class ScoreTrackingComponent implements OnInit {
  currentQuestion: number = 2;
  totalQuestions: number = 5;
  currentScore: number = 10;
  progressPercentage: number = 40;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {

    this.gameService.gameState$.subscribe(state => {
      this.currentQuestion = state.currentQuestion;
      this.totalQuestions = state.totalQuestions;
      this.currentScore = state.score;
      this.progressPercentage = (this.currentQuestion / this.totalQuestions) * 100;
    });
  }
}
