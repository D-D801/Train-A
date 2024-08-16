export interface UserRequest {
  name?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
}

export interface UserResponse {
  token: string;
}

export interface ErrorResponse {
  status: number;
  reason: string;
}
