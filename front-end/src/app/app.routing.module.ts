import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuizListComponent} from './Management/quizzes-management/quiz-list/quiz-list.component';
import {ActionComponent} from './Game/action/action.component';
import {CreationContainerComponent} from './Creation/creation-container/creation-container.component';
import {GameHomeComponent} from './Game/game-home/game-home.component';
import {ProfileListComponent} from './Game/profile-list/profile-list.component';
import {ConfigContainerComponent} from './quiz-configuration/config-container/config-container.component';
import {ThemeListComponent} from './themes/theme-list/theme-list.component';
import {ChildStatsComponent} from './pages/child-stats/child-stats.component';
import {QuizStatsDetailsComponent} from './pages/quiz-stats-details/quiz-stats-details.component';
import {DatePipe} from "@angular/common";
import {ChildStatsListComponent} from "./pages/child-stats-list/child-stats-list.component";
import {ProfileEditComponent} from "./Management/profile-management/profile-edit/profile-edit.component";
import {ProfileCreateComponent} from "./Management/profile-management/profile-create/profile-create.component";
import {ProfileManagementComponent} from "./Management/profile-management/profile-management.component";
import {ThemesManagementComponent} from "./themes/themes-management/themes-management.component";

import {QuizzesManagementComponent} from "./Management/quizzes-management/quizzes-management.component";
import {QuizzesByThemeComponent} from "./themes/quizzes-by-theme/quizzes-by-theme.component";
import { QuizEditComponent } from './Creation/quiz-edit/quiz-edit.component';


const routes: Routes = [
  {path: 'child-stats', component: ChildStatsComponent},

  {path: 'child-stats/:id', component: ChildStatsComponent},
  {path: 'child-stats-list', component: ChildStatsListComponent},

  {path: 'quiz-stats-details/:id', component: QuizStatsDetailsComponent},
  {path: 'game', component: GameHomeComponent},
  {path: 'profile-selection', component: ProfileListComponent},
  {path: 'themes', component: ThemeListComponent},


  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'management/profiles', component: ProfileManagementComponent},
  {path: 'management/profile/create', component: ProfileCreateComponent},
  {path: 'management/profile/edit/:id', component: ProfileEditComponent},


  {path: 'play-game', component: ActionComponent},
  {path: 'creation', component: CreationContainerComponent},
  {path: 'quiz-configuration/config-container', component: ConfigContainerComponent},
  {path: 'quiz-list', component: QuizListComponent},
  {path: 'theme/:themeId/quizzes', component: QuizzesByThemeComponent},
  {path: 'themes-management', component: ThemesManagementComponent},
  {path: 'management/quizzes-management', component: QuizzesManagementComponent},
  
  

{path: 'edit-quiz/:id',
  component: QuizEditComponent,
  title: 'Modifier le Quiz'}

];

@NgModule({

  imports: [RouterModule.forRoot(routes), DatePipe],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
