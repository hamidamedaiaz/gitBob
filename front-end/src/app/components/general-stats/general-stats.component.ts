import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ChildStatsService} from 'src/services/child-stats.service';
import {Stats} from 'src/models/stats.model';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-general-stats',
  templateUrl: './general-stats.component.html',
  styleUrls: ['./general-stats.component.scss']
})
export class GeneralStatsComponent implements OnInit, AfterViewInit {
  stats!: Stats;

  constructor(private childStatsService: ChildStatsService) {
  }

  ngOnInit(): void {
    this.stats = this.childStatsService.getGeneralStats();

    // Remplacer ici par des données plus réalistes :

    // 1. Évolution du temps de réponse
    this.stats.evolutionTimeData = {
      labels: ['Quiz Jan', 'Quiz Fév', 'Quiz Mar', 'Quiz Avr', 'Quiz Mai'],
      datasets: [
        {
          label: 'Temps moyen de réponse (s)',
          data: [14, 12, 10, 11, 9],
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: true,
          tension: 0.3
        }
      ]
    };

    // 2. Évolution des réponses correctes (3–5 images)
    this.stats.evolutionTimeData = {
      labels: ['Quiz Jan', 'Quiz Fév', 'Quiz Mar', 'Quiz Avr', 'Quiz Mai'],
      datasets: [
        {
          label: '3 images',
          data: [65, 70, 75, 80, 85],
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          fill: true,
          tension: 0.3
        },
        {
          label: '4 images',
          data: [60, 68, 72, 78, 82],
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          fill: true,
          tension: 0.3
        },
        {
          label: '5 images',
          data: [55, 63, 70, 75, 80],
          borderColor: '#9c27b0',
          backgroundColor: 'rgba(156, 39, 176, 0.2)',
          fill: true,
          tension: 0.3
        }
      ]
    };

    // 3. Répartition des types de questions (4/5/6 images)
    this.stats.quizTypePieData = {
      labels: ['4 images', '5 images', '6 images'],
      datasets: [
        {
          data: [45, 35, 20],
          backgroundColor: ['#2196f3', '#4caf50', '#ff9800'],
          borderColor: ['#ffffff', '#ffffff', '#ffffff'],
          borderWidth: 2
        }
      ]
    };
  }

  ngAfterViewInit(): void {
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        tooltip: {
          enabled: true,
          mode: 'index' as const,
        },
        legend: {
          display: true,
          labels: {color: '#333'},
          onClick: (e: any, legendItem: any, legend: any) => {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            const meta = ci.getDatasetMeta(index);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            ci.update();
          }
        },
        title: {
          display: false
        }
      },
      scales: {
        x: {display: true, ticks: {color: '#333'}, grid: {display: false}},
        y: {beginAtZero: true, ticks: {color: '#333'}, grid: {color: '#eee'}}
      }
    };

    // Graphique 1 : Temps moyen de réponse
    const ctxTime = (document.getElementById('evolutionTimeChart') as HTMLCanvasElement).getContext('2d')!;
    new Chart(ctxTime, {
      type: 'line',
      data: this.stats.evolutionTimeData,
      options: commonOptions
    });

    // Graphique 2 : Évolution réponses correctes par images
    const ctxImages = (document.getElementById('evolutionImagesChart') as HTMLCanvasElement).getContext('2d')!;
    new Chart(ctxImages, {
      type: 'line',
      data: this.stats.evolutionImagesData,
      options: commonOptions
    });

    // Graphique 3 : Répartition types de questions
    const ctxPie = (document.getElementById('quizTypePieChart') as HTMLCanvasElement).getContext('2d')!;
    new Chart(ctxPie, {
      type: 'pie',
      data: this.stats.quizTypePieData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          tooltip: {enabled: true},
          legend: {display: true, labels: {color: '#333'}}
        }
      }
    });
  }
}
