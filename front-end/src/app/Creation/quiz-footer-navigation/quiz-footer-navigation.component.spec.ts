import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizFooterNavigationComponent} from './quiz-footer-navigation.component';
import {expect} from "@playwright/test";

describe('QuizFooterNavigationComponent', () => {
  let component: QuizFooterNavigationComponent;
  let fixture: ComponentFixture<QuizFooterNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizFooterNavigationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuizFooterNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
