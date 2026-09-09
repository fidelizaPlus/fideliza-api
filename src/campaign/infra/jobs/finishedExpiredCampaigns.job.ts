import { FinishExpiredCampaignService } from '@/campaign/app/services/finishExpiredCampaigns.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FinishExpiredCampaignsJob {
  constructor(private readonly finishedExpiredCampaignService: FinishExpiredCampaignService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async finishExpiredCampaigns() {
    await this.finishedExpiredCampaignService.finishExpiredCampaigns();
  }
}
