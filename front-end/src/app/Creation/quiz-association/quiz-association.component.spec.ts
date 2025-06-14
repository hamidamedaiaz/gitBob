import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {QuizAssociationComponent} from './quiz-association.component';

describe('QuizAssociationComponent', () => {
  let component: QuizAssociationComponent;
  let fixture: ComponentFixture<QuizAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizAssociationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuizAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
