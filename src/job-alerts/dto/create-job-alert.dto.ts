import { IsInt, IsString } from 'class-validator';

export class CreateJobAlertDto {
  @IsInt()
  user_id: number;

  @IsString()
  criteria: string; // JSON string
}
