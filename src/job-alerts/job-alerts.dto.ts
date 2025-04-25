import { IsInt, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateJobAlertDto {
  @IsInt()
  user_id: number;

  @IsString()
  criteria: string;
}

export class UpdateJobAlertDto extends PartialType(CreateJobAlertDto) {}
