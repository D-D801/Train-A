import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRideFormComponent } from './new-ride-form.component';

describe('NewRideFormComponent', () => {
  let component: NewRideFormComponent;
  let fixture: ComponentFixture<NewRideFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRideFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRideFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
