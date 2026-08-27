import { Headers, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignOutService } from '@/users/app/service/signout.service';
import { AuthGuard } from '../../guards/auth/auth.guard';

@ApiTags('Auth')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('auth')
export class SignOutController {
  constructor(private readonly signoutService: SignOutService) {}

  @Post('signout')
  @ApiOperation({
    summary: 'user sign out',
    description: 'Invalidates the authenticated user session',
  })
  @ApiOkResponse({ description: 'User signed out successfully' })
  @ApiUnauthorizedResponse({ description: 'Token not provided, invalid, or expired' })
  @HttpCode(HttpStatus.OK)
  async signout(@Headers('authorization') authorization: string) {
    const accessToken = authorization.split(' ')[1];
    await this.signoutService.signout(accessToken);

    return {
      message: 'User signed out successfully',
    };
  }
}
