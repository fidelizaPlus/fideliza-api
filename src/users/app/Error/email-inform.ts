import { BadRequestException } from '@nestjs/common';

export class InformEmail extends BadRequestException {
  constructor() {
    super('Inform your e-mail');
  }
}
