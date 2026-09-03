import { NotFoundException } from '@nestjs/common';

export class CampaignNotFound extends NotFoundException {
  constructor() {
    super('Campaign not found');
  }
}
