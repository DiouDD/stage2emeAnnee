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
import { OrangeAviTimesService } from './orange_avi_times.service';
import type { OrangeAviTimes } from './interfaces/orange_avi_times.entity';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  createOrangeAviTimesSchema,
  updateOrangeAviTimesSchema,
} from './schemas/orange_avi_times.schema';
import type {
  CreateOrangeAviTimesDto,
  UpdateOrangeAviTimesDto,
} from './schemas/orange_avi_times.schema';

@Controller('oat')
export class OrangeAviTimesController {
  constructor(private readonly oapsService: OrangeAviTimesService) {}

  @Get()
  async findAll(): Promise<OrangeAviTimes[]> {
    console.log('[API] GET /oat');
    const result = await this.oapsService.findAll();
    console.log('[API] GET /oat -> réponse:', result);
    return result;
  }

  @Get('profile/:profileId')
  async findByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<OrangeAviTimes[]> {
    console.log('[API] GET /oat/profile/:profileId', profileId);
    const result = await this.oapsService.findByProfile(profileId);
    console.log('[API] GET /oat/profile/:profileId', profileId, '-> réponse:', result);
    return result;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviTimes | null> {
    console.log('[API] GET /oat/:id', id);
    const result = await this.oapsService.findOne(id);
    console.log('[API] GET /oat/:id', id, '-> réponse:', result);
    return result;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createOrangeAviTimesSchema))
  async create(@Body() client: CreateOrangeAviTimesDto): Promise<OrangeAviTimes> {
    console.log('[API] POST /oat payload:', client);
    const result = await this.oapsService.create(client);
    console.log('[API] POST /oat -> réponse:', result);
    return result;
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateOrangeAviTimesSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() client: UpdateOrangeAviTimesDto,
  ): Promise<OrangeAviTimes | null> {
    console.log('[API] PUT /oat/:id', id, 'payload:', client);
    const result = await this.oapsService.update(id, client);
    console.log('[API] PUT /oat/:id', id, '-> réponse:', result);
    return result;
  }

  @Delete('profile/:profileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<void> {
    console.log('[API] DELETE /oat/profile/:profileId', profileId);
    await this.oapsService.deleteByProfile(profileId);
    console.log('[API] DELETE /oat/profile/:profileId', profileId, '-> OK');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log('[API] DELETE /oat/:id', id);
    await this.oapsService.delete(id);
    console.log('[API] DELETE /oat/:id', id, '-> OK');
  }
}
