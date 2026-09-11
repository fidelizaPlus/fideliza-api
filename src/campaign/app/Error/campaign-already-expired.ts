import { BadRequestException } from '@nestjs/common';

export class CampaignAlreadyExpired extends BadRequestException {
  constructor() {
    super('Expired campaigns cannot be published');
  }
}
