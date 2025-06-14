import {Child} from 'src/models/child.model';
import {QuizStats} from 'src/models/quiz-stats.model';
import {Observation} from 'src/models/observation.model';
import {Stats} from 'src/models/stats.model';

export const childStatsMock = {
  child: {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    age: 10,
    registrationDate: new Date('2023-09-01'),
    totalQuizzes: 15,
    bilanErgotherapie: "Bilan de l'ergothérapeute",
    photo: 'assets/bob.jpg',
    observations: [
      {
        id: 101,
        title: 'Bonne progression',
        content: 'L\'enfant montre une amélioration constante.',
        date: new Date('2023-10-15')
      },
      {id: 102, title: 'À surveiller', content: 'Difficultés sur les quiz à 4 images.', date: new Date('2023-11-01')}
    ]
  } as Child,
  children: [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      age: 10,
      registrationDate: new Date('2023-09-01'),
      totalQuizzes: 15,
      bilanErgotherapie: 'Bilan positif, quelques difficultés sur certaines activités.',
      photo: 'assets/Bob.png',
      observations: []
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Durand',
      age: 8,
      registrationDate: new Date('2023-10-05'),
      totalQuizzes: 12,
      bilanErgotherapie: 'Bilan à surveiller pour la coordination fine.',
      photo: 'assets/Bob.png',
      observations: []
    },
    {
      id: 3,
      firstName: 'Luc',
      lastName: 'Martin',
      age: 9,
      registrationDate: new Date('2023-08-20'),
      totalQuizzes: 18,
      bilanErgotherapie: 'Bilan global satisfaisant, amélioration continue.',
      photo: 'assets/Bob.png',
      observations: []
    },
    {
      id: 4,
      firstName: 'Jean',
      lastName: 'Dupont',
      age: 10,
      registrationDate: new Date('2023-09-01'),
      totalQuizzes: 15,
      bilanErgotherapie: 'Bilan positif, quelques difficultés sur certaines activités.',
      photo: 'assets/Bob.png',
      observations: []
    },
    {
      id: 5,
      firstName: 'Marie',
      lastName: 'Durand',
      age: 8,
      registrationDate: new Date('2023-10-05'),
      totalQuizzes: 12,
      bilanErgotherapie: 'Bilan à surveiller pour la coordination fine.',
      photo: 'assets/Bob.png',
      observations: []
    },
    {
      id: 6,
      firstName: 'Luc',
      lastName: 'Martin',
      age: 9,
      registrationDate: new Date('2023-08-20'),
      totalQuizzes: 18,
      bilanErgotherapie: 'Bilan global satisfaisant, amélioration continue.',
      photo: 'assets/Bob.png',
      observations: []
    }
  ],
  quizzes: [
    {
      id: 1,
      name: 'Quiz Formes géométriques',
      theme: 'Géométrie',
      date: new Date('2023-10-01'),
      score: 80,
      timeEmitted: 60
    },
    {id: 2, name: 'Quiz Véhicules', theme: 'Véhicules', date: new Date('2023-10-15'), score: 85, timeEmitted: 55},
    {id: 3, name: 'Quiz Fruits', theme: 'Fruits', date: new Date('2023-11-01'), score: 78, timeEmitted: 50}
  ] as QuizStats[],
  generalStats: {
    quizCompletionRate: 85,
    improvementCorrectRate: 10,
    averageResponseTime: 12,
    totalQuestions: 50,
    avgImagesPerQuestion: 4,
    totalQuizzes: 5,
    positiveResponseTrend: 'En augmentation de 5% par quiz',
    reactionTimeTrend: 'Temps de réaction moyen stable',
    helpUsageTrend: 'Aide utilisée dans 20% des questions',
    chartData: {},
    chartOptions: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {beginAtZero: true}
      }
    },
    evolutionTimeData: {
      labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
      datasets: [{
        label: 'Temps de réponse (s)',
        data: [12, 15, 11, 17, 9],
        borderColor: '#3f51b5',
        fill: false
      }]
    },
    evolutionImagesData: {
      labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
      datasets: [
        {
          label: '3 images',
          data: [60, 65, 70, 75, 80],
          borderColor: '#3f51b5',
          fill: false
        },
        {
          label: '4 images',
          data: [55, 60, 65, 70, 75],
          borderColor: '#303f9f',
          fill: false
        },
        {
          label: '5 images',
          data: [50, 55, 60, 65, 70],
          borderColor: '#1a237e',
          fill: false
        }
      ]
    },
    quizTypePieData: {
      labels: ['4 images', '5 images', '6 images'],
      datasets: [{
        data: [50, 30, 20],
        backgroundColor: ['#3f51b5', '#303f9f', '#1a237e']
      }]
    }
  } as Stats,
  observations: [
    {
      id: 101,
      title: 'Bonne progression',
      content: 'L\'enfant montre une amélioration constante.',
      date: new Date('2023-10-15')
    },
    {
      id: 102,
      title: 'À surveiller',
      content: 'Quelques difficultés sur les quiz à 4 images.',
      date: new Date('2023-11-01')
    }
  ] as Observation[],
};

export const quizStatsDetailMock = {
  id: 1,
  name: "Quiz 1 : Formes géométriques",
  theme: "Géométrie",
  date: new Date('2023-10-01'),
  score: 80,
  timeEmitted: 60,
  averageResponseTime: 10,
  totalQuestions: 10,
  responseAccuracy: 80,
  totalHelpUsed: 2,
  averageReactionTime: 2.5,
  stdDeviationResponseTime: 1.2,
  questions: [
    {questionNumber: 1, responseTime: 12, helpUsed: false, correct: true, reactionTime: 2},
    {questionNumber: 2, responseTime: 9, helpUsed: true, correct: false, reactionTime: 3},
    {questionNumber: 3, responseTime: 10, helpUsed: false, correct: true, reactionTime: 2.5},
    {questionNumber: 4, responseTime: 11, helpUsed: false, correct: true, reactionTime: 2.3},
    {questionNumber: 5, responseTime: 8, helpUsed: false, correct: true, reactionTime: 2},
    {questionNumber: 6, responseTime: 10, helpUsed: false, correct: true, reactionTime: 2.7},
    {questionNumber: 7, responseTime: 13, helpUsed: true, correct: false, reactionTime: 3.2},
    {questionNumber: 8, responseTime: 9, helpUsed: false, correct: true, reactionTime: 2.1},
    {questionNumber: 9, responseTime: 11, helpUsed: false, correct: true, reactionTime: 2.4},
    {questionNumber: 10, responseTime: 10, helpUsed: false, correct: true, reactionTime: 2.0}
  ],
  chartData: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10'],
    datasets: [{
      label: 'Temps de réponse (s)',
      data: [12, 9, 10, 11, 8, 10, 13, 9, 11, 10],
      borderColor: '#1e90ff',
      fill: false
    }]
  },
  chartOptions: {
    responsive: true,
    scales: {y: {beginAtZero: true}}
  },
  distributionByImagesData: {
    labels: ['3 images', '4 images', '5 images', '6 images'],
    datasets: [{
      label: 'Précision (%)',
      data: [65, 70, 75, 80],
      backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#4BC0C0']
    }]
  },
  positiveResponsesChartData: {
    labels: ['Correctes', 'Incorrectes'],
    datasets: [{
      data: [8, 2],
      backgroundColor: ['#36A2EB', '#FF6384']
    }]
  },
  helpUsedChartData: {
    labels: ['Aide utilisée', 'Sans aide'],
    datasets: [{
      data: [2, 8],
      backgroundColor: ['#32CD32', '#FFD700']
    }]
  },
  scatterChartData: {
    datasets: [{
      label: 'Temps réaction vs réponse',
      data: [
        {x: 2, y: 12},
        {x: 3, y: 9},
        {x: 2.5, y: 10},
        {x: 2.3, y: 11},
        {x: 2, y: 8},
        {x: 2.7, y: 10},
        {x: 3.2, y: 13},
        {x: 2.1, y: 9},
        {x: 2.4, y: 11},
        {x: 2.0, y: 10}
      ],
      backgroundColor: '#FF6384'
    }]
  }
};

