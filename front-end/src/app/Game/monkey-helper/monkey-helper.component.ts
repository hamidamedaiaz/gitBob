import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-monkey-helper',
  templateUrl: './monkey-helper.component.html',
  styleUrls: ['./monkey-helper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonkeyHelperComponent implements OnInit, OnDestroy {
  helpVisible = false;
  timerActive = false;
  showAttentionPulse = false;
  monkeyImagePath = 'assets/monkey-helper.png';

  private autoHideTimer: any;
  private attentionTimer: any;
  private removeAttentionTimer: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startAttentionAnimation();
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
  }

  toggleHelp(): void {
    if (this.helpVisible) {
      this.hideHelp();
    } else {
      this.showHelp();
    }
  }

  showHelp(): void {
    this.helpVisible = true;
    this.timerActive = false;
    this.showAttentionPulse = false;

    setTimeout(() => {
      this.timerActive = true;
      this.cdr.markForCheck();
    }, 100);

    this.clearAllTimers();
    this.autoHideTimer = setTimeout(() => {
      this.hideHelp();
    }, 10000);

    this.cdr.markForCheck();
  }

  hideHelp(): void {
    this.helpVisible = false;
    this.timerActive = false;
    this.clearAllTimers();

    setTimeout(() => {
      this.showAttentionPulse = true;
      this.cdr.markForCheck();
    }, 1000);

    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.helpVisible &&
      !target.closest('.help-message') &&
      !target.closest('.monkey-helper')) {
      this.hideHelp();
    }
  }

  private startAttentionAnimation(): void {
    this.attentionTimer = setTimeout(() => {
      this.showAttentionPulse = true;
      this.cdr.markForCheck();
    }, 2000);

    this.removeAttentionTimer = setTimeout(() => {
      this.showAttentionPulse = false;
      this.cdr.markForCheck();
    }, 12000);
  }

  private clearAllTimers(): void {
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer);
    }
    if (this.attentionTimer) {
      clearTimeout(this.attentionTimer);
    }
    if (this.removeAttentionTimer) {
      clearTimeout(this.removeAttentionTimer);
    }
  }
}
