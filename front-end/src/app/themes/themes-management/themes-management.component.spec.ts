import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {ThemesManagementComponent} from './themes-management.component';

describe('ThemesManagementComponent', () => {
  let component: ThemesManagementComponent;
  let fixture: ComponentFixture<ThemesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemesManagementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ThemesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
