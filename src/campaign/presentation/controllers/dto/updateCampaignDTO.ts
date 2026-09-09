import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCampaignDTO {
  @ApiPropertyOptional({
    example: 'Summer promotion',
    description: "campaign's title",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({
    example: 'Earn double points this summer',
    description: 'Campaign description',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    example: '2026-08-09',
    description: "campaign's start date",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate?: Date;

  @ApiPropertyOptional({
    example: '2026-09-09',
    description: "campaign's end date",
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate?: Date;
}
