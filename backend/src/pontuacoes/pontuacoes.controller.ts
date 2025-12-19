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
import { PontuacoesService } from './pontuacoes.service';
import { CreatePontuacoeDto } from './dto/create-pontuacoe.dto';
import { UpdatePontuacoeDto } from './dto/update-pontuacoe.dto';

@Controller('pontuacoes')
export class PontuacoesController {
  constructor(private readonly service: PontuacoesService) {}

  @Post()
  create(@Body() dto: CreatePontuacoeDto) {
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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePontuacoeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
