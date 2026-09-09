import {
  CAMPAIGN_REPOSITORY,
  type ICampaignRepository,
} from '@/campaign/domain/interface/campaign.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FinishExpiredCampaignService {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,
  ) {}

  async finishExpiredCampaigns() {
    const now = new Date();

    const expiredCampaigns = await this.campaignRepository.findExpiredActiveCampaigns(now);

    for (const expiredCampaign of expiredCampaigns) {
      await this.campaignRepository.finishCampaignIfExpired(expiredCampaign.id, now);
    }
  }
}
