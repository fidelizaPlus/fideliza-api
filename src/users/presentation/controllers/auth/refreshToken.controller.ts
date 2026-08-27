import { RefreshTokenService } from '@/users/app/service/refreshToken.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenDTO } from '../dto/refreshTokenDTO';

@ApiTags('Auth')
@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly refreshSessionService: RefreshTokenService) {}
  @Post('refresh-token')
  @ApiOperation({
    summary: 'user refresh session',
    description: 'Generates a new authentication session using a valid refresh token',
  })
  @ApiBody({ type: RefreshTokenDTO })
  @ApiBadRequestResponse({ description: 'Refresh token was not provided or has an invalid format' })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is invalid, expired, or has already been rotated',
  })
  @ApiOkResponse({ description: 'Session refreshed successfully' })
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshTokenDTO: RefreshTokenDTO) {
    return this.refreshSessionService.refreshToken(refreshTokenDTO.refreshToken);
  }
}
