import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizzesManagementComponent} from './quizzes-management.component';
import {expect} from "@playwright/test";

describe('QuizzesManagementComponent', () => {
  let component: QuizzesManagementComponent;
  let fixture: ComponentFixture<QuizzesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizzesManagementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuizzesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
