export interface UserRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface UserResponse {
  token: string;
}
