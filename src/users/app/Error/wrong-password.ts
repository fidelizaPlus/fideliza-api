export class WrongPassword extends Error {
  constructor() {
    super('Wrong password');
  }
}
