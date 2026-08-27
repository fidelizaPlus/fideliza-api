import { DeleteUserService } from '@/users/app/service/deleteUser.service';
import { Role } from '@/users/domain/enum/user.enum';
import { Controller, Delete, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../interfaces/authenticatedRequest.interface';

@ApiTags('Delete user')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class DeleteManagerController {
  constructor(private readonly deleteService: DeleteUserService) {}

  @Delete('manager/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'delete a manager',
    description: 'Deletes the manager account from Supabase Auth and the application database.',
  })
  @ApiNoContentResponse({
    description: 'Manager deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Manager not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token not provided, invalid, or expired.',
  })
  @ApiNotFoundResponse({
    description: 'Manager not found.',
  })
  async deleteManager(@Req() request: AuthenticatedRequest) {
    await this.deleteService.delete(request.user.id, Role.MANAGER);
  }
}
