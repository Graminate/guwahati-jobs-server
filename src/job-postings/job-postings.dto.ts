import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateJobPostingDto {
  @IsInt()
  company_id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  salary_range?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  employment_type?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsDateString()
  expires_at?: string;

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;
}

export class UpdateJobPostingDto extends PartialType(CreateJobPostingDto) {}
