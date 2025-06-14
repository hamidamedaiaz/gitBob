import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {GameHomeComponent} from './game-home/game-home.component';
import {ActionComponent} from './action/action.component';
import {ScoreTrackingComponent} from './score-tracking/score-tracking.component';
import {SuccessFeedbackComponent} from './success-feedback/success-feedback.component';
import {FailureFeedbackComponent} from './failure-feedback/failure-feedback.component';
import {SourceImageComponent} from './source-image/source-image.component';
import {TargetImageComponent} from './target-image/target-image.component';
import {ProfileListComponent} from './profile-list/profile-list.component';
import {ProfileCardComponent} from './profile-card/profile-card.component';
import {ProfileSearchComponent} from './profile-search/profile-search.component';
import {ConfigGameComponent} from './config-game/config-game.component';
import {CompletionModalComponent} from "./completion-modal/completion-modal.component";
import {ObstacleComponent} from './obstacle/obstacle.component';
import {RocketComponent} from './rocket/rocket.component';
import {MonkeyHelperComponent}  from "./monkey-helper/monkey-helper.component";


@NgModule({
  declarations: [
    ActionComponent,
    ScoreTrackingComponent,
    GameHomeComponent,
    SuccessFeedbackComponent,
    FailureFeedbackComponent,
    SourceImageComponent,
    ProfileListComponent,
    ProfileCardComponent,
    ProfileSearchComponent,
    TargetImageComponent,
    CompletionModalComponent,
    RocketComponent,
    MonkeyHelperComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    ConfigGameComponent,
    ObstacleComponent,

  ],
  exports: [
    ActionComponent,
    ProfileCardComponent
  ]
})
export class GameModule {
}
