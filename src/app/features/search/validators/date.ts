import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { day, month, year } = control.value[0];
    const date = new Date(year, month, day).valueOf();
    const isDateValid = new Date(date).getTime() - new Date(Date.now()).setHours(0, 0, 0, 0) < 0;
    return !isDateValid ? { dateValidity: true } : null;
  };
}
