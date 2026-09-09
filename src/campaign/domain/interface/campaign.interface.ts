import { Campaign } from '../entity/campaign.entity';
import { Status } from '../enum/status.enum';

export interface CreateCampaignData {
  managerId: string;
  title: string;
  description: string;
  status: Status;
  startDate: Date;
  endDate: Date;
}

export interface ICampaignRepository {
  createCampaign(data: CreateCampaignData): Promise<Campaign>;
  findCampaignById(id: string): Promise<Campaign | null>;
  findCampaignByTitle(title: string): Promise<Campaign | null>;
  findCampaignByManager(managerId: string): Promise<Campaign[]>;
  findExpiredActiveCampaigns(now: Date): Promise<Campaign[]>;
  finishCampaignIfExpired(id: string, now: Date): Promise<boolean>;
  updateCampaign(campaign: Campaign): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
}

// injection token
export const CAMPAIGN_REPOSITORY = Symbol('CAMPAIGN_REPOSITORY');
