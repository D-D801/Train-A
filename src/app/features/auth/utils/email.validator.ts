import { AbstractControl, Validators } from '@angular/forms';

export function emailValidator(field: AbstractControl): Validators | null {
  const value = field.value || '';
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(value.trim()) ? null : { passwordInvalid: 'The email is not valid' };
}
