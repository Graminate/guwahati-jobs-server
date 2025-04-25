import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { JobAlertsService } from './job-alerts.service';
import { CreateJobAlertDto, UpdateJobAlertDto } from './job-alerts.dto';

@Controller('job-alerts')
export class JobAlertsController {
  constructor(private readonly jobAlertsService: JobAlertsService) {}

  @Post()
  create(@Body() createJobAlertDto: CreateJobAlertDto) {
    return this.jobAlertsService.create(createJobAlertDto);
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.jobAlertsService.findByUser(+userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobAlertDto: UpdateJobAlertDto,
  ) {
    return this.jobAlertsService.update(+id, updateJobAlertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobAlertsService.remove(+id);
  }
}
