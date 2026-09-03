import { NotFoundException } from '@nestjs/common';

export class ManagerNotFound extends NotFoundException {
  constructor() {
    super('Manager not found');
  }
}
