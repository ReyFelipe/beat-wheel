import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatWheelComponent } from './beat-wheel.component';

describe('BeatWheelComponent', () => {
  let component: BeatWheelComponent;
  let fixture: ComponentFixture<BeatWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeatWheelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
