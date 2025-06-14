import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizQuestionEditorComponent} from './quiz-question-editor.component';
import {expect} from "@playwright/test";

describe('QuizQuestionEditorComponent', () => {
  let component: QuizQuestionEditorComponent;
  let fixture: ComponentFixture<QuizQuestionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizQuestionEditorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuizQuestionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
