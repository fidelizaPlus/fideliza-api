import { BadRequestException } from '@nestjs/common';

export class CampaignStartDateInPast extends BadRequestException {
  constructor() {
    super('Campaign start date can not be in the past');
  }
}
