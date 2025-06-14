import {ComponentFixture, TestBed} from '@angular/core/testing';
import {expect} from "@playwright/test";

import {ProfileCreateComponent} from './profile-create.component';

describe('ProfileCreateComponent', () => {
  let component: ProfileCreateComponent;
  let fixture: ComponentFixture<ProfileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCreateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
