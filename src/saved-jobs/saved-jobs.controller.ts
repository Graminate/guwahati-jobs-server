import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { SavedJobsService } from './saved-jobs.service';
import { CreateSavedJobDto } from './dto/create-saved-job.dto';

@Controller('saved-jobs')
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Post()
  create(@Body() createSavedJobDto: CreateSavedJobDto) {
    return this.savedJobsService.create(createSavedJobDto);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.savedJobsService.findByUser(+userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savedJobsService.remove(+id);
  }
}
