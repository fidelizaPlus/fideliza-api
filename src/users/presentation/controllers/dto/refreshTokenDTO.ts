import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({
    example: 'eyJhbGciOi...',
    description: 'user refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
