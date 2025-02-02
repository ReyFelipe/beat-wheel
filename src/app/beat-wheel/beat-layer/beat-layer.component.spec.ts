import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatLayerComponent } from './beat-layer.component';

describe('BeatLayerComponent', () => {
  let component: BeatLayerComponent;
  let fixture: ComponentFixture<BeatLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeatLayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
