import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {PairesComponent} from './paires.component';

describe('PairesComponent', () => {
  let component: PairesComponent;
  let fixture: ComponentFixture<PairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PairesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
