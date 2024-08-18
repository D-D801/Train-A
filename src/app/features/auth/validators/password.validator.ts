import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.value.trim().length < length ? { password: true } : null;
}

export function matchPasswordsValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const passwordControl = formGroup.controls[passwordField];
    const confirmPasswordControl = formGroup.controls[confirmPasswordField];

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ confirmedValidator: 'Passwords do not match' });
      return { confirmedValidator: 'Passwords do not match' };
    }
    confirmPasswordControl.setErrors(null);
    return null;
  };
}
