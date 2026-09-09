import { ListCampaignService } from '@/campaign/app/services/listCampaign.service';
import { AuthGuard } from '@/users/presentation/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '@/users/presentation/interfaces/authenticatedRequest.interface';
import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Campaign')
@Controller('campaign')
export class ListCampaignController {
  constructor(private readonly listCampaignService: ListCampaignService) {}

  @Get()
  @ApiOperation({
    summary: 'List campaigns',
    description: 'Managers can list their own campaigns.',
  })
  @ApiNotFoundResponse({
    description: 'Manager not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Token not provided, invalid, or expired.',
  })
  @ApiForbiddenResponse({
    description: 'Only managers can list campaigns.',
  })
  @ApiOkResponse({
    description: 'Returns the campaigns belonging to the authenticated manager.',
  })
  @HttpCode(HttpStatus.OK)
  async listCampaigns(@Req() req: AuthenticatedRequest) {
    return this.listCampaignService.listCampaign(req.user.id);
  }
}
