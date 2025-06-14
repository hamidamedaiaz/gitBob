import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2
} from '@angular/core';
import {SoundService} from "../../../services/sound.service";
import {RocketService} from "../../../services/rocket.service";


export interface SourceImageData {
  id: number;
  src: string;
  alt: string;
  pair: number;
}

@Component({
  selector: 'app-source-image',
  templateUrl: './source-image.component.html',
  styleUrls: ['./source-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceImageComponent {
  @Input() image: SourceImageData = {
    id: 0,
    src: '',
    alt: '',
    pair: 0
  };
  @Input() showHint: boolean = false;
  @Input() isPlaced: boolean = false;

  @Output() imageDragged = new EventEmitter<SourceImageData>();
  @Output() dragUpdate = new EventEmitter<{ sourceId: number, x: number, y: number, width: number, height: number }>();
  @Output() dragEnd = new EventEmitter<void>();


  originalPosition: { x: number, y: number } | null = null;


  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private rocketService: RocketService,  // Add this
    private soundService: SoundService
  ) {

  }


  onImageClick(event: MouseEvent): void {
    console.log('Image clicked:', this.image.id);

    if (this.isPlaced) {
      console.log('Image is already placed, preventing rocket launch');
      return;
    }

    if (!this.rocketService.canLaunchRocket()) {
      console.log('Rocket is already active or animating, cannot launch');
      return;
    }
    this.renderer.addClass(this.elementRef.nativeElement, 'pulse-on-click');
    setTimeout(() => {
      this.renderer.removeClass(this.elementRef.nativeElement, 'pulse-on-click');
    }, 300);

    this.rocketService.launchRocket(
      this.image,
      this.elementRef,
      event.clientX,
      event.clientY
    );
    this.soundService.playDragSound();
  }


}
