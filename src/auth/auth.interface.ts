export interface SignInSuccess {
  success: boolean;
  token: string;
}

export interface SignInFailed {
  success: boolean;
  message: string;
}