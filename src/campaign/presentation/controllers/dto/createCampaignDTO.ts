import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCampaignDTO {
  @ApiProperty({
    example: 'Summer promotion',
    description: "campaign's title",
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: 'Earn double points this summer',
    description: 'Campaign description',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: '2026-08-09',
    description: "campaign's start date",
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate!: Date;

  @ApiProperty({
    example: '2026-09-09',
    description: "campaign's end date",
  })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate!: Date;
}
