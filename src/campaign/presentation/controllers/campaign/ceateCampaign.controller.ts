import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCampaignDTO } from '../dto/createCampaignDTO';
import { CreateCampaignService } from '@/campaign/app/services/createCampaign.service';
import type { AuthenticatedRequest } from '@/users/presentation/interfaces/authenticatedRequest.interface';
import { AuthGuard } from '@/users/presentation/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Campaign')
@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CreateCampaignService) {}

  @Post()
  @ApiOperation({
    summary: 'create campaign',
    description: 'manager can create a new campaign',
  })
  @ApiBody({ type: CreateCampaignDTO })
  @ApiCreatedResponse({
    description: 'Campaign created successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Token not provided, invalid, or expired.',
  })
  @ApiForbiddenResponse({
    description: 'Only managers can create campaigns.',
  })
  @ApiNotFoundResponse({
    description: 'Manager not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid campaign data or dates.',
  })
  @HttpCode(HttpStatus.CREATED)
  async createCampaign(@Body() data: CreateCampaignDTO, @Req() req: AuthenticatedRequest) {
    return this.campaignService.campaignCreate({
      ...data,
      managerId: req.user.id,
    });
  }
}
