import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {CreationContainerComponent} from './creation-container.component';

describe('CreationContainerComponent', () => {
  let component: CreationContainerComponent;
  let fixture: ComponentFixture<CreationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationContainerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
