import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function longitudeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let isLongitudeValid;
    if (control.value <= 180 && control.value >= -180) isLongitudeValid = true;
    return !isLongitudeValid ? { longitudeValidity: true } : null;
  };
}
