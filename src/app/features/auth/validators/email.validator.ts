import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    !/^[\w\d_]+@[\w\d_]+.\w{2,7}$/.test(control.value) ? { emailRegex: 'Incorrect email' } : null;
}
