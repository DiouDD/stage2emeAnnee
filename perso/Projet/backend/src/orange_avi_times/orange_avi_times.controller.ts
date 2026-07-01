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
import { OrangeAviTimesService } from './orange_avi_times.service';
import type { OrangeAviTimes } from './interfaces/orange_avi_times.entity';

@Controller('oat')
export class OrangeAviTimesController {
  constructor(private readonly oapsService: OrangeAviTimesService) {}

  @Get()
  findAll(): Promise<OrangeAviTimes[]> {
    return this.oapsService.findAll();
  }

  @Get('profile/:profileId')
  findByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<OrangeAviTimes[]> {
    return this.oapsService.findByProfile(profileId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviTimes | null> {
    return this.oapsService.findOne(id);
  }

  @Post()
  create(
    @Body() client: Omit<OrangeAviTimes, 'uid'> & { profileUid?: number },
  ): Promise<OrangeAviTimes> {
    return this.oapsService.create(client);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() client: Partial<OrangeAviTimes>,
  ): Promise<OrangeAviTimes | null> {
    return this.oapsService.update(id, client);
  }

  @Delete('profile/:profileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<void> {
    return this.oapsService.deleteByProfile(profileId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.oapsService.delete(id);
  }
}
