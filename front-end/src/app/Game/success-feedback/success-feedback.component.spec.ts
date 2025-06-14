import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {SuccessFeedbackComponent} from './success-feedback.component';

describe('SuccessFeedbackComponent', () => {
  let component: SuccessFeedbackComponent;
  let fixture: ComponentFixture<SuccessFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessFeedbackComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SuccessFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
