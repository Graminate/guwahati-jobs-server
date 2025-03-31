import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  // Retrieve messages for a given user (could be extended with query params for sender/receiver)
  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.messagesService.findByUser(+userId);
  }
}
