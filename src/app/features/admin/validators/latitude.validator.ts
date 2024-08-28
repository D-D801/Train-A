import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function latitudeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let isLatitudeValid;
    if (control.value <= 90 && control.value >= -90) isLatitudeValid = true;
    return !isLatitudeValid ? { latitudeValidity: true } : null;
  };
}
