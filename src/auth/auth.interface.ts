export interface SignInSuccess {
  success: boolean;
  access_token: string;
}

export interface SignInFailed {
  success: boolean;
  message: string;
}