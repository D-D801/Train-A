import { FormGroup } from '@angular/forms';

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
