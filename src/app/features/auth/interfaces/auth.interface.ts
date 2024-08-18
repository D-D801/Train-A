export interface UserRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  lastName: string;
}

export interface UserResponse {
  token: string;
}
