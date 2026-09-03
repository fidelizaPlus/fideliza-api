import { Campaign as DomainCampaign } from '@/campaign/domain/entity/campaign.entity';
import { Campaign as PrismaCampaign } from 'generated/prisma/client';

export class CampaignMapper {
  static toDomain(campaign: PrismaCampaign): DomainCampaign {
    return new DomainCampaign(
      campaign.id,
      campaign.managerId,
      campaign.title,
      campaign.description,
      campaign.status,
      campaign.startDate,
      campaign.endDate,
      campaign.createdAt,
      campaign.updatedAt,
      campaign.deletedAt ?? undefined,
      campaign.finishedAt ?? undefined,
    );
  }
}
