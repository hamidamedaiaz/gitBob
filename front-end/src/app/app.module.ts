import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {QuizListComponent} from './Management/quizzes-management/quiz-list/quiz-list.component';
import {QuizComponent} from './Management/quizzes-management/quiz/quiz.component';
import {AppRoutingModule} from './app.routing.module';

import {GeneralStatsComponent} from './components/general-stats/general-stats.component';
import {ChildStatsComponent} from './pages/child-stats/child-stats.component';
import {ObservationComponent} from './components/observation/observation.component';
import {ChildInfoComponent} from './components/child-info/child-info.component';
import {QuizStatsDetailsComponent} from './pages/quiz-stats-details/quiz-stats-details.component';
import {QuizStatsChartsComponent} from './components/quiz-stats-charts/quiz-stats-charts.component';
import {HeaderComponent} from './header/header.component';
import {ThemeComponent} from './themes/theme/theme.component';
import {ThemeListComponent} from './themes/theme-list/theme-list.component';

import {GameModule} from './Game/game.module';
import {CreationContainerComponent} from './Creation/creation-container/creation-container.component';
import {ButtonCComponent} from './Creation/button-c/button-c.component';
import {QuizStatsComponent} from "./components/quiz-stats/quiz-stats.component";
import {ChildStatsListComponent} from "./pages/child-stats-list/child-stats-list.component";
import {ThemesManagementComponent} from "./themes/themes-management/themes-management.component";
import {QUizTypeComponent} from "./Creation/quiztype/quiztype.component";
import {QuizzesManagementComponent} from "./Management/quizzes-management/quizzes-management.component";
import {QuizzesByThemeComponent} from "./themes/quizzes-by-theme/quizzes-by-theme.component";
import {ProfileStatsCardComponent} from "./components/profile-stats-card/profile-stats-card.component";

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    QuizStatsComponent,
    ChildInfoComponent,
    ObservationComponent,
    GeneralStatsComponent,
    ChildStatsComponent,
    QuizStatsDetailsComponent,
    QuizStatsChartsComponent,
    ProfileStatsCardComponent,

    ChildStatsListComponent,

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    GameModule,
    CreationContainerComponent,
    ButtonCComponent,
    HeaderComponent,
    ThemesManagementComponent,
    ThemeListComponent,
    ThemeComponent,
    QuizzesByThemeComponent,
    QUizTypeComponent,
    QuizzesManagementComponent,
    QuizComponent,
    QuizListComponent,

  ],
  providers: []
})
export class AppModule {
}

