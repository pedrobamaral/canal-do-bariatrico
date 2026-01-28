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
import { CicloService } from './ciclo.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';

@Controller('ciclo')
export class CicloController {
  constructor(private readonly service: CicloService) {}

  @Post()
  async create(@Body() dto: CreateCicloDto) {
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

  @Get('usuario/:idUsuario')
  async findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    try {
      const result = await this.service.findByUsuario(idUsuario);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCicloDto,
  ) {
    try {
      const result = await this.service.update(id, dto);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Patch(':id/finalizar')
  async finalizar(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.service.finalizarCiclo(id);
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
