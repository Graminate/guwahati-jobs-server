import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CandidateProfilesService } from './candidate-profiles.service';
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';

@Controller('candidates')
export class CandidateProfilesController {
  constructor(
    private readonly candidateProfilesService: CandidateProfilesService,
  ) {}

  @Post()
  create(@Body() createCandidateProfileDto: CreateCandidateProfileDto) {
    return this.candidateProfilesService.create(createCandidateProfileDto);
  }

  @Get()
  findAll() {
    return this.candidateProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidateProfilesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCandidateProfileDto: UpdateCandidateProfileDto,
  ) {
    return this.candidateProfilesService.update(+id, updateCandidateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidateProfilesService.remove(+id);
  }
}
