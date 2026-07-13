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
import { OrangeAviSviService } from './orange_avi_svi.service';
import type { OrangeAviSvi } from './interfaces/orange_avi_svi.entity';
import type {
  CreateOrangeAviSviDto,
  UpdateOrangeAviSviDto,
} from './orange_avi_svi.dto';

@Controller('oasvi')
export class OrangeAviSviController {
  constructor(private readonly oasService: OrangeAviSviService) {}

  @Get()
  findAll(): Promise<OrangeAviSvi[]> {
    return this.oasService.findAll();
  }

  @Get('profile/:profileId')
  findByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<OrangeAviSvi[]> {
    return this.oasService.findByProfile(profileId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<OrangeAviSvi | null> {
    return this.oasService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateOrangeAviSviDto): Promise<OrangeAviSvi> {
    return this.oasService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrangeAviSviDto,
  ): Promise<OrangeAviSvi | null> {
    return this.oasService.update(id, body);
  }

  @Delete('profile/:profileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<void> {
    return this.oasService.deleteByProfile(profileId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.oasService.delete(id);
  }
}
