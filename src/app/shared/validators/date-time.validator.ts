import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateTimeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { value } = control;

    if (!value || value.length !== 2) {
      return { incorrectDateTime: true };
    }

    const [date, time] = value;

    if (!date || !time) {
      return { incorrectDateTime: true };
    }

    const { day, month, year } = date;
    const { hours, minutes } = time;

    if (!(day && month && year)) {
      return { incorrectDateTime: true };
    }

    if (hours == null || minutes == null) {
      return { incorrectDateTime: true };
    }

    return null;
  };
}

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { value: date } = control;

    if (!date) {
      return { incorrectDateTime: true };
    }

    const { day, month, year } = date;

    if (!(day && month && year)) {
      return { incorrectDateTime: true };
    }

    return null;
  };
}
