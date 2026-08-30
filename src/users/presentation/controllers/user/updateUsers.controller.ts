import { UpdateUsersService } from '@/users/app/service/updateUsers.service';
import { Body, Controller, HttpCode, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../interfaces/authenticatedRequest.interface';
import { UpdateUserDTO } from '../dto/updateUserDTO';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('users')
export class UpdateUsersController {
  constructor(private readonly updateUserService: UpdateUsersService) {}

  @Patch('me')
  @ApiOperation({
    summary: 'User update',
    description: 'Updates one or more editable fields of an existing user',
  })
  @ApiBody({
    description: 'Fields to update',
    type: UpdateUserDTO,
  })
  @ApiBadRequestResponse({ description: 'The request contains invalid data.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'Token not provided, invalid, or expired' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User updated successfully.' })
  async updateUsers(@Req() req: AuthenticatedRequest, @Body() data: UpdateUserDTO) {
    const updatedUser = await this.updateUserService.update(req.user.id, data);

    return {
      message: 'User updated successfully.',
      user: updatedUser,
    };
  }
}
