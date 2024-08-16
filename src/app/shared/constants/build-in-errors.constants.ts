import { of } from 'rxjs';

export const builtInErrors = {
  required: 'This field is required',
  maxlength: ({ requiredLength }: { requiredLength: string }) => `Maximum length — ${requiredLength} characters`,
  minlength: ({ requiredLength }: { requiredLength: string }) => of(`Minimum length — ${requiredLength} characters`),
  email: 'The email is invalid',
} as const;
