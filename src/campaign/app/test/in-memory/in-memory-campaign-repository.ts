/* eslint-disable @typescript-eslint/require-await */
import { Campaign } from '@/campaign/domain/entity/campaign.entity';
import type {
  CreateCampaignData,
  ICampaignRepository,
} from '@/campaign/domain/interface/campaign.interface';
import { randomUUID } from 'node:crypto';
import { CampaignNotFound } from '../../Error/campaign-not-found';

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
