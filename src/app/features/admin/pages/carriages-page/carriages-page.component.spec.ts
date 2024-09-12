import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { AlertService } from '@core/services/alert/alert.service';
import { of, throwError } from 'rxjs';
import { mockCarriage } from '@shared/constants/mock-data/mock-carriages.data';
import { Carriage } from '@shared/interfaces/carriage.interface';
import { CarriagesPageComponent } from './carriages-page.component';

const mockCarriageApiService = {
  getCarriages: jest.fn(() => of([] as Carriage[])),
  createCarriage: jest.fn(),
  updateCarriage: jest.fn(),
};

const mockAlertService = {
  open: jest.fn(),
};

describe('CarriagePageComponent', () => {
  let component: CarriagesPageComponent;
  let fixture: ComponentFixture<CarriagesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarriagesPageComponent],
      providers: [
        provideHttpClient(),
        { provide: CarriageApiService, useValue: mockCarriageApiService },
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CarriagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load carriages successfully', () => {
    const mockCarriages = [mockCarriage];
    mockCarriageApiService.getCarriages.mockReturnValue(of(mockCarriages));

    component.loadCarriages().subscribe((carriages) => {
      expect(carriages).toEqual(mockCarriages);
      expect(component.carriages()).toEqual(mockCarriages);
    });
  });

  it('should handle error while loading carriages', () => {
    const errorMessage = 'Error loading carriages';
    mockCarriageApiService.getCarriages.mockReturnValue(throwError(() => new Error(errorMessage)));

    component.loadCarriages().subscribe({
      error: (error) => {
        expect(error.message).toBe(errorMessage);
        expect(mockAlertService.open).toHaveBeenCalledWith({
          message: errorMessage,
          label: 'Error',
          appearance: 'error',
        });
      },
    });
  });

  it('should create a new carriage', () => {
    mockCarriageApiService.createCarriage.mockReturnValue(of(mockCarriage));

    component.createCarriage(mockCarriage);

    expect(mockCarriageApiService.createCarriage).toHaveBeenCalledWith(mockCarriage);
    expect(component.newCarriages()).toContainEqual({ ...mockCarriage, code: 'test-carriage' });
  });

  it('should update carriage and reload carriages', () => {
    const allCarriages: Carriage[] = [mockCarriage];
    mockCarriageApiService.updateCarriage.mockReturnValue(of(null));
    mockCarriageApiService.getCarriages.mockReturnValue(of(allCarriages));

    component.updateCarriage(mockCarriage);

    expect(mockCarriageApiService.updateCarriage).toHaveBeenCalledWith(mockCarriage);
    expect(component.carriages()).toEqual(allCarriages);
    expect(component.newCarriages()).toEqual([]);
  });
});
