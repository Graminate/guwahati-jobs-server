import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto, UpdateInterviewDto } from './interviews.dto';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewsService.create(createInterviewDto);
  }

  @Get()
  findAll() {
    return this.interviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
  ) {
    return this.interviewsService.update(+id, updateInterviewDto);
  }
}
