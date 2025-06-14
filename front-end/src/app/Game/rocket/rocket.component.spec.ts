import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {RocketComponent} from './rocket.component';

describe('RocketComponent', () => {
  let component: RocketComponent;
  let fixture: ComponentFixture<RocketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RocketComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
