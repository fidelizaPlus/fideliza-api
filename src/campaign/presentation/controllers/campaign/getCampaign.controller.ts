import { GetCampaignByIdService } from '@/campaign/app/services/getCampaignById.service';
import { AuthGuard } from '@/users/presentation/guards/auth/auth.guard';
import type { AuthenticatedRequest } from '@/users/presentation/interfaces/authenticatedRequest.interface';
import {
  Controller,
  Get,
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
export class GetCampaignByIdController {
  constructor(private readonly getCampaignByIdService: GetCampaignByIdService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'get a campaign',
    description: 'manager can search for a specific campaign',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the campaign to retrieve.',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Returns the campaign belonging to the authenticated manager.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token not provided, invalid, or expired.',
  })
  @ApiForbiddenResponse({
    description: 'The user is not a manager or does not own the campaign.',
  })
  @ApiNotFoundResponse({
    description: 'Manager or campaign not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid campaign ID format.',
  })
  @HttpCode(HttpStatus.OK)
  async getCampaign(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    return this.getCampaignByIdService.getCampaign(req.user.id, id);
  }
}
