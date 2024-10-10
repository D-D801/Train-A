import { inject, Injectable, signal } from '@angular/core';
import { CarriageApiService } from '@features/admin/services/carriage-api/carriage-api.service';
import { switchMap, tap } from 'rxjs';
import { Carriage } from '@shared/interfaces/carriage.interface';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class CarriagesService {
  private readonly carriageApiService = inject(CarriageApiService);

  private readonly alert = inject(AlertService);

  private readonly _carriages = signal<Carriage[]>([]);

  public carriages = this._carriages.asReadonly();

  public addCarriages() {
    return this.carriageApiService.getCarriages().pipe(
      tap({
        next: (carriages) => {
          this._carriages.set(carriages);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      })
    );
  }

  public updateCarriage(carriageData: Carriage) {
    return this.carriageApiService.updateCarriage(carriageData).pipe(
      switchMap(() => this.addCarriages()),
      tap({
        next: (carriages) => {
          this._carriages.set(carriages);
        },
        error: ({ error: { message } }) => {
          this.alert.open({ message, label: 'Error', appearance: 'error' });
        },
      })
    );
  }

  public getCarriageByCode(code: string) {
    return this.carriages().find((carriage) => carriage.code === code);
  }

  public getCarriageNamesByCodes(codes: string[]) {
    return codes.map((code) => this.getCarriageNameByCode(code));
  }

  public getCarriageNameByCode(code: string) {
    return this.carriages().find((carriage) => carriage.code === code)?.name ?? '';
  }

  public getCarriageCodesByNames(names: string[]) {
    return names.map((name) => this.getCarriageCodeByName(name));
  }

  public getCarriageCodeByName(name: string) {
    return this.carriages().find((carriage) => carriage.name === name)?.code ?? '';
  }
}
