import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {FailureFeedbackComponent} from './failure-feedback.component';

describe('FailureFeedbackComponent', () => {
  let component: FailureFeedbackComponent;
  let fixture: ComponentFixture<FailureFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailureFeedbackComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FailureFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
