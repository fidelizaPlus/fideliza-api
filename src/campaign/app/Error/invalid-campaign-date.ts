import { BadRequestException } from '@nestjs/common';

export class InvalidCampaignDate extends BadRequestException {
  constructor() {
    super('Campaign end date must be later than start date');
  }
}
