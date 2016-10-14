export class AuthenticationStatus {
  isAuthenticated: boolean;
  username: string;
  errorMessage: string;

  constructor(isAuthenticated: boolean, username: string, errorMessage: string) {
    this.isAuthenticated = isAuthenticated;
    this.username = username;
    this.errorMessage = errorMessage;
  }
}
