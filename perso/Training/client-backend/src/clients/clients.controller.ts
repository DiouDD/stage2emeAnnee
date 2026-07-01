import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import * as clientInterface from './interfaces/client.interface';
import { Client } from './interfaces/client.interface';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  findAll(): clientInterface.Client[] {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): clientInterface.Client {
    return this.clientsService.findOne(id);
  }

  @Post()
  create(@Body() client: Omit<Client, 'id'>): clientInterface.Client {
    return this.clientsService.create(client);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() client: Partial<Client>,
  ): clientInterface.Client {
    return this.clientsService.update(id, client);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.delete(id);
  }
}
