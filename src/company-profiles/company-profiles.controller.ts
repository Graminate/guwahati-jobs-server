import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CompanyProfilesService } from './company-profiles.service';
import {
  CreateCompanyProfileDto,
  UpdateCompanyProfileDto,
} from './company-profiles.dto';

@Controller('companies')
export class CompanyProfilesController {
  constructor(
    private readonly companyProfilesService: CompanyProfilesService,
  ) {}

  @Post()
  create(@Body() createCompanyProfileDto: CreateCompanyProfileDto) {
    return this.companyProfilesService.create(createCompanyProfileDto);
  }

  @Get()
  findAll() {
    return this.companyProfilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyProfilesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyProfileDto: UpdateCompanyProfileDto,
  ) {
    return this.companyProfilesService.update(+id, updateCompanyProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyProfilesService.remove(+id);
  }
}
