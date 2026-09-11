import { BadRequestException } from '@nestjs/common';

export class CampaignNotDraft extends BadRequestException {
  constructor() {
    super('Only draft campaigns can be published');
  }
}
