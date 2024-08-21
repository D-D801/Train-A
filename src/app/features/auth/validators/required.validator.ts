import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.value.trim().length === 0 ? { required: true } : null;
}
