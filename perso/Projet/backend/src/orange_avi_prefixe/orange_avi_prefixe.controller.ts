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
import { OrangeAviPrefixeService } from './orange_avi_prefixe.service';
import type { OrangeAviPrefixe } from './interfaces/orange_avi_prefixe.entity';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  createOrangeAviPrefixeSchema,
  updateOrangeAviPrefixeSchema,
} from './schemas/orange_avi_prefixe.schema';
import type {
  CreateOrangeAviPrefixeDto,
  UpdateOrangeAviPrefixeDto,
} from './schemas/orange_avi_prefixe.schema';

@Controller('oapres')
export class OrangeAviPrefixeController {
  constructor(private readonly oapsService: OrangeAviPrefixeService) {}

  @Get()
  findAll(): Promise<OrangeAviPrefixe[]> {
    return this.oapsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviPrefixe | null> {
    return this.oapsService.findOne(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createOrangeAviPrefixeSchema))
  create(@Body() client: CreateOrangeAviPrefixeDto): Promise<OrangeAviPrefixe> {
    return this.oapsService.create(client);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateOrangeAviPrefixeSchema))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() client: UpdateOrangeAviPrefixeDto,
  ): Promise<OrangeAviPrefixe | null> {
    return this.oapsService.update(id, client);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.oapsService.delete(id);
  }
}
