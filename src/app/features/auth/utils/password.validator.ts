import { AbstractControl, FormGroup, Validators } from '@angular/forms';

export function passwordValidator(field: AbstractControl): Validators | null {
  const value = field.value || '';
  const regex = /^(?!\s)(.{8,})(?!\s)$/;

  return regex.test(value.trim())
    ? null
    : { passwordInvalid: 'Password must be at least 8 characters long and have no spaces at the beginning or end' };
}

export function matchPasswordsValidator(passwordField: string, confirmPasswordField: string) {
  return (formGroup: FormGroup) => {
    const passwordControl = formGroup.controls[passwordField];
    const confirmPasswordControl = formGroup.controls[confirmPasswordField];

    if (confirmPasswordControl!.errors && !confirmPasswordControl!.errors?.['confirmedValidator']) {
      return null;
    }

    return passwordControl.value === confirmPasswordControl.value
      ? confirmPasswordControl.setErrors(null)
      : confirmPasswordControl.setErrors({ confirmedValidator: 'Passwords do not match' });
  };
}
