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
  findAll(): Promise<OrangeAviPrefixe[]> {
    return this.oapsService.findAll();
  }

  /** `GET /oapres/:id` — récupère un préfixe par son uid. */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrangeAviPrefixe | null> {
    return this.oapsService.findOne(id);
  }

  /**
   * `POST /oapres` — crée un préfixe.
   * Le corps de la requête est validé par {@link createOrangeAviPrefixeSchema} (Zod).
   */
  @Post()
  @UsePipes(new ZodValidationPipe(createOrangeAviPrefixeSchema))
  create(@Body() client: CreateOrangeAviPrefixeDto): Promise<OrangeAviPrefixe> {
    return this.oapsService.create(client);
  }

  /**
   * `PUT /oapres/:id` — met à jour un préfixe.
   * Le corps de la requête est validé par {@link updateOrangeAviPrefixeSchema} (Zod) ;
   * tous les champs sont optionnels.
   */
  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateOrangeAviPrefixeSchema))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() client: UpdateOrangeAviPrefixeDto,
  ): Promise<OrangeAviPrefixe | null> {
    return this.oapsService.update(id, client);
  }

  /** `DELETE /oapres/:id` — supprime un préfixe ; répond `204 No Content`. */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.oapsService.delete(id);
  }
}
