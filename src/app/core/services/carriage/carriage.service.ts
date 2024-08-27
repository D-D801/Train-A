import { inject, Injectable } from '@angular/core';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class CarriageService {
  private readonly carriageApiService = inject(CarriageApiService);

  private readonly alert = inject(AlertService);

  public readonly carriages = toSignal(
    this.carriageApiService.getCarriages().pipe(
      tap({
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      })
    ),
    { initialValue: [] }
  );
}
