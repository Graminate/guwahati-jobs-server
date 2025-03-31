import { IsInt, IsOptional, IsString, IsUrl, IsObject } from 'class-validator';

export class CreateCompanyProfileDto {
  @IsInt()
  user_id: number;

  @IsString()
  company_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsObject()
  social_links?: Record<string, string>;
}
