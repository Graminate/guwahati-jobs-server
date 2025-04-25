import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';


export class CreateCandidateProfileDto {
  @IsInt()
  user_id: number;

  @IsOptional()
  @IsString()
  resume_text?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsUrl()
  portfolio_url?: string;
}



export class UpdateCandidateProfileDto extends PartialType(
  CreateCandidateProfileDto,
) {}
