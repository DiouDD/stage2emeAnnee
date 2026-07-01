import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrangeAviProfileService } from './orange_avi_profile.service';
import type { OrangeAviProfile } from './interfaces/orange_avi_profile.entity';

@Controller('oapros')
export class OrangeAviProfileController {
  constructor(private readonly oapsService: OrangeAviProfileService) {}

  @Get()
  findAll(): Promise<OrangeAviProfile[]> {
    return this.oapsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviProfile | null> {
    return this.oapsService.findOne(id);
  }

  @Post()
  create(
    @Body() client: Omit<OrangeAviProfile, 'id'>,
  ): Promise<OrangeAviProfile> {
    return this.oapsService.create(client);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() client: Partial<OrangeAviProfile>,
  ): Promise<OrangeAviProfile | null> {
    return this.oapsService.update(id, client);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.oapsService.delete(id);
  }
}
