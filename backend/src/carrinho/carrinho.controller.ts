import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import * as carrinhoDto from './dto/carrinho.dto';

@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Post()
  async create(@Body() data: carrinhoDto.CarrinhoDto) {
    return this.carrinhoService.create(data);
  }

  @Get()
  async findAll() {
    return this.carrinhoService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.carrinhoService.getById(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: carrinhoDto.CarrinhoDto) {
    return this.carrinhoService.update(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.carrinhoService.delete(Number(id));
  }
}
