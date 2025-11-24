import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import * as produtoDto from './entities/produto.entity';
import { createProdutoDto } from './dto/createprodutodto.dto';
import { UpdateProdutoDto } from './dto/updateproduto.dto';

@Controller('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  async create(@Body() createProdutoDto: createProdutoDto) {
    return this.produtoService.create(createProdutoDto);
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
  async update(@Param('id') id: string, @Body() UpdateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.update(Number(id), UpdateProdutoDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.produtoService.delete(Number(id));
  }
}
