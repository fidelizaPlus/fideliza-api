import { ForbiddenException } from '@nestjs/common';

export class NotCampaignOwner extends ForbiddenException {
  constructor() {
    super('You are not the owner of this campaign');
  }
}
