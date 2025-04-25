import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateReviewDto {
  @IsInt()
  user_id: number;

  @IsInt()
  company_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  review_text?: string;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
