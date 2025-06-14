import {Component, OnInit} from '@angular/core';
import {QuizStats} from 'src/models/quiz-stats.model';
import {ChildStatsService} from 'src/services/child-stats.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-quiz-stats',
  templateUrl: './quiz-stats.component.html',
  styleUrls: ['./quiz-stats.component.scss']
})
export class QuizStatsComponent implements OnInit {
  quizzes: QuizStats[] = [];

  constructor(private childStatsService: ChildStatsService, private router: Router) {
  }


  ngOnInit(): void {
    this.quizzes = this.childStatsService.getQuizzes();
    console.log('Quizzes:', this.quizzes);
  }

  goToQuizDetails(quizId: number) {
    this.router.navigate(['/quiz-stats-details', quizId]);
  }

}
