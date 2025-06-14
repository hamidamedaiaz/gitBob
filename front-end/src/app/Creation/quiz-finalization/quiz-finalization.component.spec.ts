import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizFinalizationComponent} from './quiz-finalization.component';
import {expect} from "@playwright/test";

describe('QuizFinalizationComponent', () => {
  let component: QuizFinalizationComponent;
  let fixture: ComponentFixture<QuizFinalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizFinalizationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuizFinalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
