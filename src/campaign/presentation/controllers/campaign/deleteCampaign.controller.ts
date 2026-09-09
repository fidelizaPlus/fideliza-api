import { DeleteCampaignService } from '@/campaign/app/services/deleteCampaign.service';
import { AuthGuard } from '@/users/presentation/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '@/users/presentation/interfaces/authenticatedRequest.interface';
import { Controller, Delete, HttpCode, HttpStatus, Param, Req, UseGuards } from '@nestjs/common';
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
@Controller('deleteCampaign')
export class DeleteCampaignController {
  constructor(private readonly deleteCampaignService: DeleteCampaignService) {}

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a campaign',
    description: 'Manager can delete a campaign',
  })
  @ApiNotFoundResponse({
    description: 'Campaign or manager not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Token not provided, invalid, or expired.',
  })
  @ApiForbiddenResponse({
    description: 'Only the manager who owns the campaign can delete it.',
  })
  @ApiOkResponse({ description: 'Campaign deleted successfully.' })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.deleteCampaignService.campaignDelete(id, request.user.id);
  }
}
