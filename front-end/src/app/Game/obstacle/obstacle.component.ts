
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Obstacle} from '../../../models/obstacle.model';

@Component({
  selector: 'app-obstacle',
  templateUrl: './obstacle.component.html',
  styleUrls: ['./obstacle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class ObstacleComponent implements OnInit, OnChanges {
  @Input() obstacle!: Obstacle;
  isColliding: boolean = false;

  obstacleStyle: any = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.updateObstacleStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['obstacle'] && changes['obstacle'].currentValue) {
      this.updateObstacleStyle();

      this.cdr.detectChanges();
    }
  }

  getHueRotation(color: string): number {
    const colorMap: { [key: string]: number } = {
      '#FF5722': 0,
      '#FF9800': 30,
      '#FFC107': 50,
      '#FFEB3B': 60,
      '#8BC34A': 120,
      '#4CAF50': 140
    };
    return colorMap[color] || 0;
  }

  private updateObstacleStyle(): void {
    if (this.obstacle) {

      this.obstacleStyle = {
        position: 'absolute',
        left: `${this.obstacle.x}%`,
        top: `${this.obstacle.y}%`,
        width: `${this.obstacle.width}%`,
        height: `${this.obstacle.height}%`,

        transition: this.obstacle.type === 'moving'
          ? 'top 0.3s ease-out, left 0.3s ease-out'
          : 'none',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        transform: 'translateZ(0)',
        willChange: this.obstacle.type === 'moving' ? 'top, left' : 'auto'
      };
    }
  }
}
