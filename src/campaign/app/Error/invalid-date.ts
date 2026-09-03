import { BadRequestException } from '@nestjs/common';

export class InvalidDate extends BadRequestException {
  constructor() {
    super('Date is not valid');
  }
}
