import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { NewRideService } from '@features/admin/services/new-ride/new-ride.service';
import { NewRideFormComponent } from './new-ride-form.component';

describe('NewRideFormComponent', () => {
  let component: NewRideFormComponent;
  let componentRef: ComponentRef<NewRideFormComponent>;
  let fixture: ComponentFixture<NewRideFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRideFormComponent],
      providers: [provideHttpClient(), NewRideService],
    }).compileComponents();

    fixture = TestBed.createComponent(NewRideFormComponent);
    component = fixture.componentInstance;

    componentRef = fixture.componentRef;
    componentRef.setInput('path', [1, 2]);
    componentRef.setInput('carriages', ['car1', 'car2']);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
