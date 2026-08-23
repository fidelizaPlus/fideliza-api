export class EmailAlreadyExists extends Error {
  constructor() {
    super('E-mail alrady exists');
  }
}
