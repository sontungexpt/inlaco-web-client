export interface LoginPayload {
  username: string;
  password: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ResendTwoStepVerificationRequest {
  username: string;
}
