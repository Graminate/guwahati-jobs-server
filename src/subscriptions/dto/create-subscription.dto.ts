import { IsInt, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsInt()
  user_id: number;

  @IsString()
  subscription_type: string;

  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
