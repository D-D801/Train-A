export const mockUser = {
  email: 'test@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  name: 'John',
} as const;

export const mockLoginUser = {
  email: 'test@example.com',
  password: 'Password123!',
} as const;

export const mockTokenResponse = {
  token: 'testToken',
} as const;
