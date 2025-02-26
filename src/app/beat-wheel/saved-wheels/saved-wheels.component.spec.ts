import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedWheelsComponent } from './saved-wheels.component';

describe('SavedWheelsComponent', () => {
  let component: SavedWheelsComponent;
  let fixture: ComponentFixture<SavedWheelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedWheelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedWheelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
