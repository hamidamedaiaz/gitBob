
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {RocketService} from '../../../services/rocket.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-rocket',
  templateUrl: './rocket.component.html',
  styleUrls: ['./rocket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RocketComponent implements OnInit, OnDestroy {
  visible = false;
  x = 0;
  y = 0;
  angle = 0;
  rocketState: 'idle' | 'flying' | 'landing' | 'returning' = 'idle';

  private subscription: Subscription | null = null;

  constructor(
    private rocketService: RocketService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.rocketService.rocketState$.subscribe(state => {
      this.visible = state.active;
      this.x = state.x;
      this.y = state.y;
      this.angle = state.angle;

      if (state.returning) {
        this.rocketState = 'returning';
      } else if (state.animating && state.targetId) {
        this.rocketState = 'landing';
      } else if (state.active) {
        this.rocketState = 'flying';
      } else {
        this.rocketState = 'idle';
      }

      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getTransform(): string {
    return `translate(${this.x}px, ${this.y}px) rotate(${this.angle}deg)`;
  }


}

