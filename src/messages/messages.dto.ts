import { IsInt, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  sender_id: number;

  @IsInt()
  receiver_id: number;

  @IsString()
  content: string;
}
