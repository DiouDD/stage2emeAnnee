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
  UsePipes,
} from '@nestjs/common';
import { OrangeAviSvi2Service } from './orange_avi_svi2.service';
import type { OrangeAviSvi2 } from './interfaces/orange_avi_svi2.entity';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  createOrangeAviSvi2Schema,
  updateOrangeAviSvi2Schema,
} from './schemas/orange_avi_svi2.schema';
import type {
  CreateOrangeAviSvi2Dto,
  UpdateOrangeAviSvi2Dto,
} from './schemas/orange_avi_svi2.schema';

@Controller('oasvi2')
export class OrangeAviSvi2Controller {
  constructor(private readonly oasService: OrangeAviSvi2Service) {}

  @Get()
  findAll(): Promise<OrangeAviSvi2[]> {
    return this.oasService.findAll();
  }

  @Get('profile/:profileId')
  findByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<OrangeAviSvi2[]> {
    return this.oasService.findByProfile(profileId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviSvi2 | null> {
    return this.oasService.findOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createOrangeAviSvi2Schema))
  create(@Body() body: CreateOrangeAviSvi2Dto): Promise<OrangeAviSvi2> {
    return this.oasService.create(body);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateOrangeAviSvi2Schema))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrangeAviSvi2Dto,
  ): Promise<OrangeAviSvi2 | null> {
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
