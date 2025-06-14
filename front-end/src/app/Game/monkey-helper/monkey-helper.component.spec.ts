import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonkeyHelperComponent } from './monkey-helper.component';

describe('MonkeyHelperComponent', () => {
  let component: MonkeyHelperComponent;
  let fixture: ComponentFixture<MonkeyHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonkeyHelperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonkeyHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
