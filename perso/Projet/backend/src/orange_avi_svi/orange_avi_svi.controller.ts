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
import { OrangeAviSviService } from './orange_avi_svi.service';
import type { OrangeAviSvi } from './interfaces/orange_avi_svi.entity';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  createOrangeAviSviSchema,
  updateOrangeAviSviSchema,
} from './schemas/orange_avi_svi.schema';
import type {
  CreateOrangeAviSviDto,
  UpdateOrangeAviSviDto,
} from './schemas/orange_avi_svi.schema';

@Controller('oasvi')
export class OrangeAviSviController {
  constructor(private readonly oasService: OrangeAviSviService) {}

  @Get()
  async findAll(): Promise<OrangeAviSvi[]> {
    console.log('[API] GET /oasvi');
    const result = await this.oasService.findAll();
    console.log('[API] GET /oasvi -> réponse:', result);
    return result;
  }

  @Get('profile/:profileId')
  async findByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<OrangeAviSvi[]> {
    console.log('[API] GET /oasvi/profile/:profileId', profileId);
    const result = await this.oasService.findByProfile(profileId);
    console.log('[API] GET /oasvi/profile/:profileId', profileId, '-> réponse:', result);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<OrangeAviSvi | null> {
    console.log('[API] GET /oasvi/:id', id);
    const result = await this.oasService.findOne(id);
    console.log('[API] GET /oasvi/:id', id, '-> réponse:', result);
    return result;
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createOrangeAviSviSchema))
  async create(@Body() body: CreateOrangeAviSviDto): Promise<OrangeAviSvi> {
    console.log('[API] POST /oasvi payload:', body);
    const result = await this.oasService.create(body);
    console.log('[API] POST /oasvi -> réponse:', result);
    return result;
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateOrangeAviSviSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrangeAviSviDto,
  ): Promise<OrangeAviSvi | null> {
    console.log('[API] PUT /oasvi/:id', id, 'payload:', body);
    const result = await this.oasService.update(id, body);
    console.log('[API] PUT /oasvi/:id', id, '-> réponse:', result);
    return result;
  }

  @Delete('profile/:profileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteByProfile(
    @Param('profileId', ParseIntPipe) profileId: number,
  ): Promise<void> {
    console.log('[API] DELETE /oasvi/profile/:profileId', profileId);
    await this.oasService.deleteByProfile(profileId);
    console.log('[API] DELETE /oasvi/profile/:profileId', profileId, '-> OK');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log('[API] DELETE /oasvi/:id', id);
    await this.oasService.delete(id);
    console.log('[API] DELETE /oasvi/:id', id, '-> OK');
  }
}
