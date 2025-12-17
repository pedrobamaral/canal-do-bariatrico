import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { TreinoService } from './treino.service';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';

@Controller('treino')
export class TreinoController {
  constructor(private readonly treinoService: TreinoService) {}

  @Post()
  create(@Body() createTreinoDto: CreateTreinoDto) {
    return this.treinoService.create(createTreinoDto);
  }

  @Get()
  findAll() {
    return this.treinoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.treinoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTreinoDto: UpdateTreinoDto) {
    return this.treinoService.update(id, updateTreinoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.treinoService.remove(id);
  }
}