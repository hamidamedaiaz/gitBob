import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChildStatsService} from 'src/services/child-stats.service';
import {QuizStatsDetail} from 'src/models/quiz-stats-detail.model';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-quiz-stats-details',
  templateUrl: './quiz-stats-details.component.html',
  styleUrls: ['./quiz-stats-details.component.scss']
})
export class QuizStatsDetailsComponent implements OnInit, AfterViewInit {

  quizStats!: QuizStatsDetail;

  constructor(private route: ActivatedRoute, private childStatsService: ChildStatsService) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.quizStats = this.childStatsService.getQuizStatsDetail(id);
  }

  ngAfterViewInit(): void {

    const ctxLine = (document.getElementById('quizStatsChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctxLine!, {
      type: 'line',
      data: this.quizStats.chartData,
      options: this.quizStats.chartOptions
    });


    const ctxScatter = (document.getElementById('scatterChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctxScatter!, {
      type: 'scatter',
      data: this.quizStats.scatterChartData,
      options: {
        responsive: true,
        plugins: {title: {display: true, text: 'Relation temps réaction vs réponse'}},
        scales: {
          x: {title: {display: true, text: 'Temps de réaction (s)'}},
          y: {title: {display: true, text: 'Temps de réponse (s)'}, beginAtZero: true}
        }
      }
    });


    const ctxDoughnut1 = (document.getElementById('positiveResponsesChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctxDoughnut1!, {
      type: 'doughnut',
      data: this.quizStats.positiveResponsesChartData,
      options: {responsive: true, plugins: {title: {display: true, text: 'Répartition des réponses'}}}
    });

    const ctxDoughnut2 = (document.getElementById('helpUsedChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctxDoughnut2!, {
      type: 'doughnut',
      data: this.quizStats.helpUsedChartData,
      options: {responsive: true, plugins: {title: {display: true, text: 'Utilisation d\'aides'}}}
    });


  }
}
