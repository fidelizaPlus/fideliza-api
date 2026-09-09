import {
  CAMPAIGN_REPOSITORY,
  type ICampaignRepository,
} from '@/campaign/domain/interface/campaign.interface';
import { type IUserRepository, USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ManagerNotFound } from '../Error/manager-not-found';
import { Role } from '@/users/domain/enum/user.enum';
import { NotManager } from '../Error/not-manager';

@Injectable()
export class ListCampaignService {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async listCampaign(managerId: string) {
    const manager = await this.userRepository.findUserById(managerId);

    if (!manager) throw new ManagerNotFound();

    if (manager.role !== Role.MANAGER) throw new NotManager();

    const campaigns = await this.campaignRepository.findCampaignByManager(managerId);

    return campaigns;
  }
}
