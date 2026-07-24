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
  async findAll(): Promise<OrangeAviProfile[]> {
    console.log('[API] GET /oapros');
    const result = await this.oapsService.findAll();
    console.log('[API] GET /oapros -> réponse:', result);
    return result;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviProfile | null> {
    console.log('[API] GET /oapros/:id', id);
    const result = await this.oapsService.findOne(id);
    console.log('[API] GET /oapros/:id', id, '-> réponse:', result);
    return result;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createOrangeAviProfileSchema))
  async create(@Body() client: CreateOrangeAviProfileDto): Promise<OrangeAviProfile> {
    console.log('[API] POST /oapros payload:', client);
    const result = await this.oapsService.create(client);
    console.log('[API] POST /oapros -> réponse:', result);
    return result;
  }

  @Post(':id/duplicate')
  async duplicate(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviProfile> {
    console.log('[API] POST /oapros/:id/duplicate', id);
    const result = await this.oapsService.duplicate(id);
    console.log('[API] POST /oapros/:id/duplicate', id, '-> réponse:', result);
    return result;
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateOrangeAviProfileSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() client: UpdateOrangeAviProfileDto,
  ): Promise<OrangeAviProfile | null> {
    console.log('[API] PUT /oapros/:id', id, 'payload:', client);
    const result = await this.oapsService.update(id, client);
    console.log('[API] PUT /oapros/:id', id, '-> réponse:', result);
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log('[API] DELETE /oapros/:id', id);
    await this.oapsService.delete(id);
    console.log('[API] DELETE /oapros/:id', id, '-> OK');
  }
}
