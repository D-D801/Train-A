import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const latitudeBoundaryValue = 90;

export function latitudeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return !(control.value <= latitudeBoundaryValue && control.value >= -latitudeBoundaryValue)
      ? { latitudeValidity: true }
      : null;
  };
}
