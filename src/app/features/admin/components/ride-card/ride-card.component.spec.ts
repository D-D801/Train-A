import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideCardComponent } from './ride-card.component';

describe('RideCardComponent', () => {
  let component: RideCardComponent;
  let fixture: ComponentFixture<RideCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RideCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
