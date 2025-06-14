import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import {SoundService} from '../../../services/sound.service';
import {RocketService} from '../../../services/rocket.service';
import {GameService} from '../../../services/game.service';
import {SourceImageData} from '../source-image/source-image.component';
import {fromEvent, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

export interface TargetImageData {
  id: number;
  src: string;
  alt: string;
  label: string;
  pair: number;
}

@Component({
  selector: 'app-target-image',
  templateUrl: './target-image.component.html',
  styleUrls: ['./target-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetImageComponent implements OnInit, OnDestroy {
  @Input() target: TargetImageData = {
    id: 0,
    src: '',
    alt: '',
    label: '',
    pair: 0
  };
  @Input() showHint: boolean = false;

  @Output() dropSuccess = new EventEmitter<{ source: SourceImageData, target: TargetImageData }>();

  droppedImage: SourceImageData | null = null;
  isOver: boolean = false;

  private rocketStateSub: Subscription | null = null;
  private mouseSub: Subscription | null = null;
  private mouseUpSub: Subscription | null = null;

  constructor(
    private soundService: SoundService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private rocketService: RocketService,
    private gameService: GameService
  ) {
    console.log('TargetImageComponent constructed');
  }

  ngOnInit(): void {
    this.mouseUpSub = fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(filter(() => this.rocketService.isRocketActive()))
      .subscribe(event => {
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        const {x, y} = this.rocketService.getRocketPosition();

        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          this.handleRocketLanding();
        }
      });

    this.mouseSub = fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseover')
      .pipe(filter(() => this.rocketService.isRocketActive()))
      .subscribe(() => {
        if (!this.droppedImage) {
          this.isOver = true;
          this.cdr.markForCheck();
        }
      });

    const mouseOutSub = fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseout')
      .pipe(filter(() => this.rocketService.isRocketActive()))
      .subscribe(() => {
        this.isOver = false;
        this.cdr.markForCheck();
      });

    this.rocketStateSub = mouseOutSub;
  }

  ngOnDestroy(): void {
    if (this.rocketStateSub) {
      this.rocketStateSub.unsubscribe();
    }
    if (this.mouseSub) {
      this.mouseSub.unsubscribe();
    }
    if (this.mouseUpSub) {
      this.mouseUpSub.unsubscribe();
    }
  }

  speakLabel(event: Event): void {
    event.stopPropagation();

    if (this.target && this.target.label) {
      console.log('Speaking label:', this.target.label);

      const speech = new SpeechSynthesisUtterance();
      speech.text = this.target.label;
      speech.lang = 'fr-FR';
      speech.volume = 1;
      speech.rate = 0.9;
      speech.pitch = 1;

      window.speechSynthesis.speak(speech);
      this.soundService.playDragSound();
    }
  }

  handleRocketLanding(): void {
    console.log('Rocket landing on target:', this.target.id);

    if (this.droppedImage !== null) {
      console.log('Target already has an image, rejecting landing');
      this.rocketService.returnRocketToSource();
      return;
    }

    const sourceId = this.rocketService.getCurrentSourceId();
    if (!sourceId) {
      console.warn('No active rocket to land');
      return;
    }

    this.gameService.getSourceById(sourceId).subscribe(sourceImage => {
      if (sourceImage) {
        const isCorrectMatch = sourceImage.pair === this.target.pair;

        this.isOver = true;
        this.cdr.markForCheck();

        setTimeout(() => {
          this.rocketService.landRocket(this.target.id, isCorrectMatch);

          this.droppedImage = sourceImage;

          this.dropSuccess.emit({
            source: sourceImage,
            target: this.target
          });

          this.isOver = false;
          this.cdr.markForCheck();
        }, 100);
      }
    });
  }
}
