import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {ObstacleComponent} from './obstacle.component';

describe('ObstacleComponent', () => {
  let component: ObstacleComponent;
  let fixture: ComponentFixture<ObstacleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObstacleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ObstacleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
