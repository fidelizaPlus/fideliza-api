import { Module } from '@nestjs/common';
import { PrismaModule } from '@/shared/prisma/prismaService.module';
import { UserModule } from '@/users/user.module';
import { CreateCampaignService } from './app/services/createCampaign.service';
import { UpdateCampaignService } from './app/services/updateCampaign.service';
import { DeleteCampaignService } from './app/services/deleteCampaign.service';
import { CAMPAIGN_REPOSITORY } from './domain/interface/campaign.interface';
import { CampaignRepository } from './repository/campaign.repository';
import { CampaignController } from './presentation/controllers/campaign/ceateCampaign.controller';
import { UpdateCampaignController } from './presentation/controllers/campaign/updateCampaign.controller';
import { DeleteCampaignController } from './presentation/controllers/campaign/deleteCampaign.controller';
import { FinishExpiredCampaignService } from './app/services/finishExpiredCampaigns.service';
import { FinishExpiredCampaignsJob } from './infra/jobs/finishedExpiredCampaigns.job';
import { ListCampaignService } from './app/services/listCampaign.service';
import { ListCampaignController } from './presentation/controllers/campaign/listCampaigns.controller';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [
    CreateCampaignService,
    UpdateCampaignService,
    DeleteCampaignService,
    FinishExpiredCampaignService,
    FinishExpiredCampaignsJob,
    ListCampaignService,
    {
      provide: CAMPAIGN_REPOSITORY,
      useClass: CampaignRepository,
    },
  ],
  controllers: [
    CampaignController,
    UpdateCampaignController,
    DeleteCampaignController,
    ListCampaignController,
  ],
  exports: [CreateCampaignService, UpdateCampaignService, DeleteCampaignService],
})
export class CampaignModule {}
