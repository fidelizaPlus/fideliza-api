import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDTO {
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
}
