import { Status } from '@/campaign/domain/enum/status.enum';
import { CAMPAIGN_REPOSITORY } from '@/campaign/domain/interface/campaign.interface';
import type {
  CreateCampaignData,
  ICampaignRepository,
} from '@/campaign/domain/interface/campaign.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ManagerNotFound } from '../Error/manager-not-found';
import { USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import type { IUserRepository } from '@/users/domain/interface/user.interface';
import { Role } from '@/users/domain/enum/user.enum';
import { NotManager } from '../Error/not-manager';
import { InvalidCampaignDate } from '../Error/invalid-campaign-date';
import { InvalidDate } from '../Error/invalid-date';
import { CampaignStartDateInPast } from '../Error/startDate-past';

@Injectable()
export class CreateCampaignService {
  constructor(
    @Inject(CAMPAIGN_REPOSITORY)
    private readonly campaignRepository: ICampaignRepository,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async campaignCreate(data: Omit<CreateCampaignData, 'status'>) {
    const manager = await this.userRepository.findUserById(data.managerId);

    if (!manager) throw new ManagerNotFound();

    if (manager.role !== Role.MANAGER) throw new NotManager();

    // verifying date
    if (
      !(data.startDate instanceof Date) ||
      !(data.endDate instanceof Date) ||
      Number.isNaN(data.startDate.getTime()) ||
      Number.isNaN(data.endDate.getTime())
    )
      throw new InvalidDate();

    //start date now in past
    const now = new Date();
    if (data.startDate < now) throw new CampaignStartDateInPast();

    //
    if (data.endDate <= data.startDate) throw new InvalidCampaignDate();

    // save in db
    return this.campaignRepository.createCampaign({
      ...data,
      status: Status.DRAFT,
    });
  }
}
