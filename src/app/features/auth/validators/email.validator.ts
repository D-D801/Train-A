import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    !/.{8,}/.test(control.value.trim()) ? { minLength: 'At least 8 characters required' } : null;
}
