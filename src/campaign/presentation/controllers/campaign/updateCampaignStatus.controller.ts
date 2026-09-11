import { PublishCampaignService } from '@/campaign/app/services/publishCampaign.service';
import { AuthGuard } from '@/users/presentation/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '@/users/presentation/interfaces/authenticatedRequest.interface';
import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Campaign')
@Controller('campaign')
export class PublishCampaignController {
  constructor(private readonly publishCampaignService: PublishCampaignService) {}

  @Patch(':id/publish')
  @ApiOperation({
    summary: 'Publish a campaign',
    description: 'Publishes a draft campaign, scheduling or activating it based on its start date.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the campaign to publish.',
    type: String,
    format: 'uuid',
  })
  @ApiUnauthorizedResponse({
    description: 'Token not provided, invalid, or expired.',
  })
  @ApiNotFoundResponse({
    description: 'Campaign or manager not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid campaign ID format, campaign is not a draft, or campaign has expired.',
  })
  @ApiForbiddenResponse({
    description: 'The user is not a manager or does not own the campaign.',
  })
  @ApiOkResponse({
    description: 'Campaign published successfully with SCHEDULED or ACTIVE status.',
  })
  @HttpCode(HttpStatus.OK)
  async updateCampaignStatus(
    @Param('id', ParseUUIDPipe) campaignId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.publishCampaignService.publish(req.user.id, campaignId);
  }
}
