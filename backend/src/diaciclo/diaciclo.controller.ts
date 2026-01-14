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
import { DiaCicloService } from './diaciclo.service';
import { CreateDiaCicloDto } from './dto/create-diaciclo.dto';
import { UpdateDiaCicloDto } from './dto/update-diaciclo.dto';

@Controller('diaciclo')
export class DiaCicloController {
  constructor(private readonly service: DiaCicloService) {}

  @Post()
  create(@Body() dto: CreateDiaCicloDto) {
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
    @Body() dto: UpdateDiaCicloDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
