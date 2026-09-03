import { CAMPAIGN_REPOSITORY } from '@/campaign/domain/interface/campaign.interface';
import type { ICampaignRepository } from '@/campaign/domain/interface/campaign.interface';
import { USER_REPOSITORY, type IUserRepository } from '@/users/domain/interface/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ManagerNotFound } from '../Error/manager-not-found';
import { NotManager } from '../Error/not-manager';
import { Role } from '@/users/domain/enum/user.enum';
import { CampaignNotFound } from '../Error/campaign-not-found';
import { NotCampaignOwner } from '../Error/not-campaign-owner';

@Injectable()
export class DeleteCampaignService {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async campaignDelete(campaignId: string, managerId: string) {
    const manager = await this.userRepository.findUserById(managerId);

    if (!manager) throw new ManagerNotFound();
    if (manager.role !== Role.MANAGER) throw new NotManager();

    const campaign = await this.campaignRepository.findCampaignById(campaignId);

    if (!campaign) throw new CampaignNotFound();
    if (campaign.managerId !== manager.id) throw new NotCampaignOwner();

    await this.campaignRepository.deleteCampaign(campaign.id);
  }
}
