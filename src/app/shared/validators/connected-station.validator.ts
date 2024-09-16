import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StationsService } from '@core/services/stations/stations.service';

export function connectedStationValidator(stationsService: StationsService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return stationsService.stations().find((station) => station.city === control.value)
      ? null
      : { invalidConnectedStation: true };
  };
}
