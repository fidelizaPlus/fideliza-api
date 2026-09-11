import { Injectable } from '@nestjs/common';
import type {
  CreateCampaignData,
  ICampaignRepository,
} from '../domain/interface/campaign.interface';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { Campaign as DomainCampaign } from '../domain/entity/campaign.entity';
import { CampaignMapper } from '@/campaign/mapper/campaign.mapper';
import { Status } from '../domain/enum/status.enum';

@Injectable()
export class CampaignRepository implements ICampaignRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCampaign(data: CreateCampaignData): Promise<DomainCampaign> {
    const campaign = await this.prisma.campaign.create({
      data: {
        managerId: data.managerId,
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });

    return CampaignMapper.toDomain(campaign);
  }

  async findCampaignById(id: string): Promise<DomainCampaign | null> {
    const campaign = await this.prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    return campaign ? CampaignMapper.toDomain(campaign) : null;
  }

  async findCampaignByTitle(title: string): Promise<DomainCampaign | null> {
    const campaign = await this.prisma.campaign.findFirst({
      where: {
        title,
      },
    });

    return campaign ? CampaignMapper.toDomain(campaign) : null;
  }

  async findCampaignByManager(managerId: string): Promise<DomainCampaign[]> {
    const campaign = await this.prisma.campaign.findMany({
      where: {
        managerId,
      },
    });

    return campaign.map((campaign) => CampaignMapper.toDomain(campaign));
  }

  async findExpiredActiveCampaigns(now: Date): Promise<DomainCampaign[]> {
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: now,
        },
      },
    });

    return campaigns.map((campaign) => CampaignMapper.toDomain(campaign));
  }

  async finishCampaignIfExpired(id: string, now: Date): Promise<boolean> {
    const campaign = await this.prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    if (!campaign) return false;

    const result = await this.prisma.campaign.updateMany({
      where: {
        id,
        status: 'ACTIVE',
        endDate: {
          lte: now,
          equals: campaign.endDate,
        },
      },
      data: {
        status: 'FINISHED',
        finishedAt: campaign.endDate,
      },
    });

    return result.count > 0;
  }

  async updateCampaign(campaign: DomainCampaign): Promise<DomainCampaign> {
    const updatedCampaign = await this.prisma.campaign.update({
      where: {
        id: campaign.id,
      },
      data: {
        title: campaign.title,
        description: campaign.description,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
      },
    });

    return CampaignMapper.toDomain(updatedCampaign);
  }

  async updateCampaignStatus(campaignId: string, status: Status): Promise<DomainCampaign> {
    const updatedStatus = await this.prisma.campaign.update({
      where: {
        id: campaignId,
      },
      data: {
        status: status,
      },
    });

    return CampaignMapper.toDomain(updatedStatus);
  }

  async deleteCampaign(id: string): Promise<void> {
    await this.prisma.campaign.delete({
      where: {
        id,
      },
    });
  }
}
