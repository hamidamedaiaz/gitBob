import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizGeneralInfoComponent} from './quiz-general-info.component';
import {expect} from "@playwright/test";

describe('QuizGeneralInfoComponent', () => {
  let component: QuizGeneralInfoComponent;
  let fixture: ComponentFixture<QuizGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizGeneralInfoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuizGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
