import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe,} from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.pagamentoService.create(createPagamentoDto);
  }

  @Get()
  findAll() {
    return this.pagamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePagamentoDto: UpdatePagamentoDto,
  ) {
    return this.pagamentoService.update(id, updatePagamentoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagamentoService.remove(id);
  }
}