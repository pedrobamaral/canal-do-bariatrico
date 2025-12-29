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
  create(@Body() dto: CreateDia0Dto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get('ciclo/:idCiclo')
  findByCiclo(@Param('idCiclo', ParseIntPipe) idCiclo: number) {
    return this.service.findByCiclo(idCiclo);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDia0Dto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
