import { SignInService } from '@/users/app/service/signin.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthDTO } from '../dto/authDTO';

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly signinService: SignInService) {}

  @Post('signin')
  @ApiOperation({
    summary: 'user sign in',
    description: 'user can sign in',
  })
  @ApiBody({ type: AuthDTO })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiOkResponse({ description: 'User signed in successfully' })
  @HttpCode(HttpStatus.OK)
  async signin(@Body() authDTO: AuthDTO) {
    return this.signinService.signin(authDTO);
  }
}
