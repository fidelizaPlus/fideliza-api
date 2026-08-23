export class InvalidPasswordLength extends Error {
  constructor() {
    super('Password should have at least 9 characters long');
  }
}
