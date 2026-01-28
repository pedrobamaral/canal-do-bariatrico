import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Dia0Service } from './dia0.service';
import { CreateDia0Dto } from './dto/create-dia0.dto';
import { UpdateDia0Dto } from './dto/update-dia0.dto';

@Controller('dia0')
export class Dia0Controller {
  constructor(private readonly service: Dia0Service) {}

  @Post()
  async create(@Body() dto: CreateDia0Dto) {
    try {
      const result = await this.service.create(dto);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.service.findAll();
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.service.findOne(id);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Get('ciclo/:idCiclo')
  async findByCiclo(@Param('idCiclo', ParseIntPipe) idCiclo: number) {
    try {
      const result = await this.service.findByCiclo(idCiclo);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDia0Dto,
  ) {
    try {
      const result = await this.service.update(id, dto);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.service.remove(id);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }
}
