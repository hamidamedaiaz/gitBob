import {AfterViewInit, Component, Input} from '@angular/core';
import {QuizStatsDetail} from 'src/models/quiz-stats-detail.model';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-quiz-stats-charts',
  templateUrl: './quiz-stats-charts.component.html',
  styleUrls: ['./quiz-stats-charts.component.scss']
})
export class QuizStatsChartsComponent implements AfterViewInit {
  @Input() quizStats!: QuizStatsDetail;

  ngAfterViewInit(): void {
    if (!this.quizStats) {
      return;
    }

    const ctxLine = (document.getElementById('quizStatsChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctxLine!, {
      type: 'line',
      data: this.quizStats.chartData,
      options: this.quizStats.chartOptions
    });


    const ctxDoughnut1 = (document.getElementById('positiveResponsesChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctxDoughnut1!, {
      type: 'doughnut',
      data: this.quizStats.positiveResponsesChartData,
      options: {
        responsive: true,
        plugins: {
          title: {display: true, text: 'Répartition des réponses'}
        }
      }
    });


    const ctxDoughnut2 = (document.getElementById('helpUsedChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctxDoughnut2!, {
      type: 'doughnut',
      data: this.quizStats.helpUsedChartData,
      options: {
        responsive: true,
        plugins: {
          title: {display: true, text: 'Utilisation d\'aides'}
        }
      }
    });


    const ctxScatter = (document.getElementById('scatterChart') as HTMLCanvasElement).getContext('2d');
    new Chart(ctxScatter!, {
      type: 'scatter',
      data: this.quizStats.scatterChartData,
      options: {
        responsive: true,
        plugins: {title: {display: true, text: 'Temps de réaction vs Réponse'}},
        scales: {
          x: {title: {display: true, text: 'Temps de réaction (s)'}},
          y: {title: {display: true, text: 'Temps de réponse (s)'}, beginAtZero: true}
        }
      }
    });
  }
}
