import { UntypedFormGroup } from '@angular/forms';

export function PasswordMatchValidator(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: UntypedFormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors['passwordNotEqual']) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordNotEqual: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
