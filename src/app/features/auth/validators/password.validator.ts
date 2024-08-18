import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.value.trim().length < length ? { password: true } : null;
}
