import { AuthService } from '@/users/app/service/userAuth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserDTO } from '../dto/usersDTO';

@ApiTags('Auth')
@Controller('auth')
export class RegisterManagerController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/manager')
  @ApiOperation({
    summary: 'Register a new user as manager',
    description: 'manager sign up',
  })
  @ApiBody({ type: RegisterUserDTO })
  @ApiCreatedResponse({ description: 'The record has been successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDTO: RegisterUserDTO) {
    return this.authService.registerManager(registerDTO);
  }
}
