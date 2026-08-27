import { DeleteUserService } from '@/users/app/service/deleteUser.service';
import { Role } from '@/users/domain/enum/user.enum';
import { Controller, Delete, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth/auth.guard';
import type { AuthenticatedRequest } from '../../interfaces/authenticatedRequest.interface';

@ApiTags('Delete user')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('users')
export class DeleteClientController {
  constructor(private readonly deleteService: DeleteUserService) {}

  @Delete('client/me')
  @ApiOperation({
    summary: 'delete a client',
    description: 'Deletes the client account from Supabase Auth and the application database.',
  })
  @ApiNotFoundResponse({
    description: 'Client not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token not provided, invalid, or expired.',
  })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @HttpCode(HttpStatus.OK)
  async deleteClient(@Req() request: AuthenticatedRequest) {
    await this.deleteService.delete(request.user.id, Role.CLIENT);

    return {
      message: 'User deleted successfully',
    };
  }
}
