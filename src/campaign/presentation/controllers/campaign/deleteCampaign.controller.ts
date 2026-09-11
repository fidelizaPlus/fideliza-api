import { DeleteCampaignService } from '@/campaign/app/services/deleteCampaign.service';
import { AuthGuard } from '@/users/presentation/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '@/users/presentation/interfaces/authenticatedRequest.interface';
import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
export class DeleteCampaignController {
  constructor(private readonly deleteCampaignService: DeleteCampaignService) {}

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID of the campaign to delete.',
    type: String,
    format: 'uuid',
  })
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
  @ApiBadRequestResponse({
    description: 'Invalid campaign ID format.',
  })
  @ApiOkResponse({ description: 'Campaign deleted successfully.' })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() request: AuthenticatedRequest) {
    await this.deleteCampaignService.campaignDelete(id, request.user.id);
    return {
      message: 'Campaign deleted successfully.',
    };
  }
}
