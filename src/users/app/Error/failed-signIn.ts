export class FailedSignIn extends Error {
  constructor() {
    super('Signin failed');
  }
}
