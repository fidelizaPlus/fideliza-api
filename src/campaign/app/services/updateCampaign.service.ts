import {
  CAMPAIGN_REPOSITORY,
  type ICampaignRepository,
} from '@/campaign/domain/interface/campaign.interface';
import { type IUserRepository, USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { NotManager } from '../Error/not-manager';
import { Role } from '@/users/domain/enum/user.enum';
import { ManagerNotFound } from '../Error/manager-not-found';
import { CampaignNotFound } from '../Error/campaign-not-found';
import { NotCampaignOwner } from '../Error/not-campaign-owner';
import type { IUpdateCampaignData } from '@/campaign/domain/interface/updateCampaignData.interface';
import { InvalidCampaignDate } from '../Error/invalid-campaign-date';
import { InvalidDate } from '../Error/invalid-date';

@Injectable()
export class UpdateCampaignService {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async updateCampaign(campaignId: string, managerId: string, data: IUpdateCampaignData) {
    const manager = await this.userRepository.findUserById(managerId);

    if (!manager) throw new ManagerNotFound();
    if (manager.role !== Role.MANAGER) throw new NotManager();

    const campaign = await this.campaignRepository.findCampaignById(campaignId);

    if (!campaign) throw new CampaignNotFound();
    if (campaign.managerId !== manager.id) throw new NotCampaignOwner();

    const startDate = data.startDate ?? campaign.startDate;
    const endDate = data.endDate ?? campaign.endDate;

    if (
      !(startDate instanceof Date) ||
      !(endDate instanceof Date) ||
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      throw new InvalidDate();
    }

    if (endDate <= startDate) throw new InvalidCampaignDate();

    Object.assign(campaign, {
      title: data.title ?? campaign.title,
      description: data.description ?? campaign.description,
      startDate,
      endDate,
    });

    return this.campaignRepository.updateCampaign(campaign);
  }
}
