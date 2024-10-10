import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { mailRegex } from '@shared/constants/mail-regex';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    !mailRegex.test(control.value) ? { emailRegex: true } : null;
}
