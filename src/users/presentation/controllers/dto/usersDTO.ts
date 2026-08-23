import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty({
    example: 'Peter Parker',
    description: 'User name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'peterparker@gmail.com',
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '123456789',
    description: 'User password',
    writeOnly: true,
    minLength: 9,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  password!: string;

  @ApiProperty({
    example: '123456789',
    description: 'Password confirmation',
    writeOnly: true,
    minLength: 9,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  passwordConfirmation!: string;
}
