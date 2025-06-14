export interface QuestionResult {
  questionNumber: number;
  responseTime: number;
  helpUsed: boolean;
  correct: boolean;
  reactionTime?: number;
}

export interface QuizStatsDetail {
  id: number;
  name: string;
  theme: string;
  date: Date;
  score: number;
  timeEmitted: number;
  averageResponseTime: number;
  totalQuestions: number;
  responseAccuracy: number;
  totalHelpUsed: number;
  averageReactionTime: number;
  stdDeviationResponseTime: number;
  questions: QuestionResult[];

  //graph
  chartData: any;
  chartOptions: any;
  distributionByImagesData: any;
  positiveResponsesChartData: any;
  helpUsedChartData: any;
  scatterChartData: any;
}
