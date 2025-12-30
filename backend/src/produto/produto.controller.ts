import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import * as produtoDto from './dto/produto.dto';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  async create(@Body() data: produtoDto.ProdutoDto) {
    return this.produtoService.create(data);
  }

  @Get()
  async findAll() {
    return this.produtoService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.produtoService.getById(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: produtoDto.ProdutoDto) {
    return this.produtoService.update(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.produtoService.delete(Number(id));
  }
}
