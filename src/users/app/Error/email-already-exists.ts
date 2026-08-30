import { ConflictException } from '@nestjs/common';

export class EmailAlreadyExists extends ConflictException {
  constructor() {
    super('E-mail alrady exists');
  }
}
