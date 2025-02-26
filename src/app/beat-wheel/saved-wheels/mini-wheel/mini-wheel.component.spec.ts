import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniWheelComponent } from './mini-wheel.component';

describe('MiniWheelComponent', () => {
  let component: MiniWheelComponent;
  let fixture: ComponentFixture<MiniWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniWheelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
