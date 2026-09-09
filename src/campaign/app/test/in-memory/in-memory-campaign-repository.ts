/* eslint-disable @typescript-eslint/require-await */
import { Campaign } from '@/campaign/domain/entity/campaign.entity';
import type {
  CreateCampaignData,
  ICampaignRepository,
} from '@/campaign/domain/interface/campaign.interface';
import { randomUUID } from 'node:crypto';
import { CampaignNotFound } from '../../Error/campaign-not-found';
import { Status } from '@/campaign/domain/enum/status.enum';

export class InMemoryCampaignRepository implements ICampaignRepository {
  public items: Campaign[] = [];

  async createCampaign(data: CreateCampaignData) {
    const createdAt = new Date();
    const updatedAt = createdAt;
    const campaign = new Campaign(
      randomUUID(),
      data.managerId,
      data.title,
      data.description,
      data.status,
      data.startDate,
      data.endDate,
      createdAt,
      updatedAt,
    );

    this.items.push(campaign);

    return campaign;
  }

  async findCampaignById(id: string) {
    const campaign = this.items.find((item) => item.id === id);

    return campaign ?? null;
  }

  async findCampaignByTitle(title: string) {
    const campaign = this.items.find((item) => item.title === title);

    return campaign ?? null;
  }

  async findCampaignByManager(managerId: string) {
    return this.items.filter((item) => item.managerId === managerId);
  }

  async findExpiredActiveCampaigns(now: Date) {
    const campaigns = this.items.filter(
      (item) => item.status === Status.ACTIVE && item.endDate <= now,
    );

    return campaigns;
  }

  async finishCampaignIfExpired(id: string, now: Date) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) return false;

    const campaign = this.items[index];

    if (campaign.status !== Status.ACTIVE || campaign.endDate > now) return false;

    this.items[index] = new Campaign(
      campaign.id,
      campaign.managerId,
      campaign.title,
      campaign.description,
      Status.FINISHED,
      campaign.startDate,
      campaign.endDate,
      campaign.createdAt,
      new Date(),
      campaign.deletedAt,
      campaign.endDate,
    );

    return true;
  }

  async updateCampaign(campaign: Campaign) {
    const index = this.items.findIndex((item) => item.id === campaign.id);

    if (index === -1) throw new CampaignNotFound();

    this.items[index] = campaign;

    return campaign;
  }

  async deleteCampaign(id: string) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) throw new CampaignNotFound();

    this.items.splice(index, 1);
  }
}
