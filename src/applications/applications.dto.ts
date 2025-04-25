import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateApplicationDto {
  @IsInt()
  job_posting_id: number;

  @IsInt()
  user_id: number;

  @IsOptional()
  @IsUrl()
  resume_url?: string;

  @IsOptional()
  @IsString()
  cover_letter?: string;

  @IsOptional()
  @IsString()
  status?: string;
}


export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}

