import { IsInt, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateInterviewDto {
  @IsInt()
  application_id: number;

  @IsDateString()
  interview_date: string;

  @IsOptional()
  @IsString()
  interview_status?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
