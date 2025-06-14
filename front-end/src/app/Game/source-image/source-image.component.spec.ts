import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {SourceImageComponent} from './source-image.component';

describe('SourceImageComponent', () => {
  let component: SourceImageComponent;
  let fixture: ComponentFixture<SourceImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceImageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SourceImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
