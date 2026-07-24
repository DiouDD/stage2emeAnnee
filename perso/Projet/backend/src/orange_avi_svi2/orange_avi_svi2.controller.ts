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
  async findAll(): Promise<OrangeAviSvi2[]> {
    console.log('[API] GET /oasvi2');
    const result = await this.oasService.findAll();
    console.log('[API] GET /oasvi2 -> réponse:', result);
    return result;
  }

  @Get('profile/:profileId')
  async findByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<OrangeAviSvi2[]> {
    console.log('[API] GET /oasvi2/profile/:profileId', profileId);
    const result = await this.oasService.findByProfile(profileId);
    console.log('[API] GET /oasvi2/profile/:profileId', profileId, '-> réponse:', result);
    return result;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviSvi2 | null> {
    console.log('[API] GET /oasvi2/:id', id);
    const result = await this.oasService.findOne(id);
    console.log('[API] GET /oasvi2/:id', id, '-> réponse:', result);
    return result;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createOrangeAviSvi2Schema))
  async create(@Body() body: CreateOrangeAviSvi2Dto): Promise<OrangeAviSvi2> {
    console.log('[API] POST /oasvi2 payload:', body);
    const result = await this.oasService.create(body);
    console.log('[API] POST /oasvi2 -> réponse:', result);
    return result;
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateOrangeAviSvi2Schema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrangeAviSvi2Dto,
  ): Promise<OrangeAviSvi2 | null> {
    console.log('[API] PUT /oasvi2/:id', id, 'payload:', body);
    const result = await this.oasService.update(id, body);
    console.log('[API] PUT /oasvi2/:id', id, '-> réponse:', result);
    return result;
  }

  @Delete('profile/:profileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<void> {
    console.log('[API] DELETE /oasvi2/profile/:profileId', profileId);
    await this.oasService.deleteByProfile(profileId);
    console.log('[API] DELETE /oasvi2/profile/:profileId', profileId, '-> OK');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log('[API] DELETE /oasvi2/:id', id);
    await this.oasService.delete(id);
    console.log('[API] DELETE /oasvi2/:id', id, '-> OK');
  }
}
