import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {TargetImageComponent} from './target-image.component';

describe('TargetImageComponent', () => {
  let component: TargetImageComponent;
  let fixture: ComponentFixture<TargetImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetImageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TargetImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
