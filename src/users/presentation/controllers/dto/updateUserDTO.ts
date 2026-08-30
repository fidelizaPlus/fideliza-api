import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: "The user's new name",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'johndoe@gmail.com',
    description: "The user's new e-mail",
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
