import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const longitudeBoundaryValue = 180;

export function longitudeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return !(control.value <= longitudeBoundaryValue && control.value >= -longitudeBoundaryValue)
      ? { longitudeValidity: true }
      : null;
  };
}
