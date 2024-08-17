export interface UserRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  token: string;
}
