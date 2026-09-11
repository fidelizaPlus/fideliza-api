import { UpdateCampaignService } from '@/campaign/app/services/updateCampaign.service';
import { AuthGuard } from '@/users/presentation/guards/auth/auth.guard';
import {
  Body,
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
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateCampaignDTO } from '../dto/updateCampaignDTO';
import type { AuthenticatedRequest } from '@/users/presentation/interfaces/authenticatedRequest.interface';

@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@ApiTags('Campaign')
@Controller('campaign')
export class UpdateCampaignController {
  constructor(private readonly updateCampaignService: UpdateCampaignService) {}

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'ID of the campaign to update.',
    type: String,
    format: 'uuid',
  })
  @ApiOperation({
    summary: 'Campaign update',
    description: 'manager can update campaigns',
  })
  @ApiBody({ type: UpdateCampaignDTO })
  @ApiUnauthorizedResponse({
    description: 'Token not provided, invalid, or expired.',
  })
  @ApiForbiddenResponse({
    description: 'Only the manager who owns the campaign can update it.',
  })
  @ApiNotFoundResponse({
    description: 'Campaign or manager not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid campaign ID format, data, or dates.',
  })
  @ApiOkResponse({
    description: 'Campaign updated successfully.',
  })
  @HttpCode(HttpStatus.OK)
  async updateCampaign(
    @Body() data: UpdateCampaignDTO,
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) campaignId: string,
  ) {
    return this.updateCampaignService.updateCampaign(campaignId, req.user.id, data);
  }
}
