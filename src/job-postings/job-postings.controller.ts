import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { JobPostingsService } from './job-postings.service';
import { CreateJobPostingDto, UpdateJobPostingDto } from './job-postings.dto';

@Controller('jobs')
export class JobPostingsController {
  constructor(private readonly jobPostingsService: JobPostingsService) {}

  @Post()
  create(@Body() createJobPostingDto: CreateJobPostingDto) {
    return this.jobPostingsService.create(createJobPostingDto);
  }

  @Get()
  findAll() {
    return this.jobPostingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobPostingsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobPostingDto: UpdateJobPostingDto,
  ) {
    return this.jobPostingsService.update(+id, updateJobPostingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobPostingsService.remove(+id);
  }
}
