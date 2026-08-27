export class FailedSignOut extends Error {
  constructor() {
    super('Signout failed');
  }
}
