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
import { OrangeAviProfileService } from './orange_avi_profile.service';
import type { OrangeAviProfile } from './interfaces/orange_avi_profile.entity';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  createOrangeAviProfileSchema,
  updateOrangeAviProfileSchema,
} from './schemas/orange_avi_profile.schema';
import type {
  CreateOrangeAviProfileDto,
  UpdateOrangeAviProfileDto,
} from './schemas/orange_avi_profile.schema';

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
  @UsePipes(new ZodValidationPipe(createOrangeAviProfileSchema))
  create(@Body() client: CreateOrangeAviProfileDto): Promise<OrangeAviProfile> {
    return this.oapsService.create(client);
  }

  @Post(':id/duplicate')
  duplicate(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviProfile> {
    return this.oapsService.duplicate(id);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateOrangeAviProfileSchema))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() client: UpdateOrangeAviProfileDto,
  ): Promise<OrangeAviProfile | null> {
    return this.oapsService.update(id, client);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.oapsService.delete(id);
  }
}
