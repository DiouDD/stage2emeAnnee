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

/**
 * Contrôleur REST de la ressource `orange_avi_prefixe`, exposée sous `/oapres`
 * (préfixes/DNIS/SDA de campagne Orange AVI). Consommé côté front par
 * `OrangeAviPrefixeService` (ngx-admin).
 */
@Controller('oapres')
export class OrangeAviPrefixeController {
  constructor(private readonly oapsService: OrangeAviPrefixeService) {}

  /** `GET /oapres` — liste tous les préfixes, profil associé inclus. */
  @Get()
  async findAll(): Promise<OrangeAviPrefixe[]> {
    console.log('[API] GET /oapres');
    const result = await this.oapsService.findAll();
    console.log('[API] GET /oapres -> réponse:', result);
    return result;
  }

  /** `GET /oapres/:id` — récupère un préfixe par son uid. */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviPrefixe | null> {
    console.log('[API] GET /oapres/:id', id);
    const result = await this.oapsService.findOne(id);
    console.log('[API] GET /oapres/:id', id, '-> réponse:', result);
    return result;
  }

  /**
   * `POST /oapres` — crée un préfixe.
   * Le corps de la requête est validé par {@link createOrangeAviPrefixeSchema} (Zod).
   */
  @Post()
  @UsePipes(new ZodValidationPipe(createOrangeAviPrefixeSchema))
  async create(@Body() client: CreateOrangeAviPrefixeDto): Promise<OrangeAviPrefixe> {
    console.log('[API] POST /oapres payload:', client);
    const result = await this.oapsService.create(client);
    console.log('[API] POST /oapres -> réponse:', result);
    return result;
  }

  /**
   * `PUT /oapres/:id` — met à jour un préfixe.
   * Le corps de la requête est validé par {@link updateOrangeAviPrefixeSchema} (Zod) ;
   * tous les champs sont optionnels.
   */
  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateOrangeAviPrefixeSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() client: UpdateOrangeAviPrefixeDto,
  ): Promise<OrangeAviPrefixe | null> {
    console.log('[API] PUT /oapres/:id', id, 'payload:', client);
    const result = await this.oapsService.update(id, client);
    console.log('[API] PUT /oapres/:id', id, '-> réponse:', result);
    return result;
  }

  /** `DELETE /oapres/:id` — supprime un préfixe ; répond `204 No Content`. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log('[API] DELETE /oapres/:id', id);
    await this.oapsService.delete(id);
    console.log('[API] DELETE /oapres/:id', id, '-> OK');
  }
}
