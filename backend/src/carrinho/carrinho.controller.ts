// src/carrinho/carrinho.controller.ts
import {Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode, HttpStatus} from '@nestjs/common';
import { CarrinhoService } from './carrinho.service';
import { CreateCarrinhoDto } from './dto/create-carrinho.dto';
import { AddProdutoDto } from './dto/add-produto.dto';

@Controller('carrinhos')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) {}

  @Post()
  create(@Body() createCarrinhoDto: CreateCarrinhoDto) {
    return this.carrinhoService.create(createCarrinhoDto);
  }

  @Get()
  findAll() {
    return this.carrinhoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carrinhoService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carrinhoService.remove(id);
  }

  // --- Rotas Especiais para Produtos ---

  @Post(':id/produtos')
  addProduto(
    @Param('id', ParseIntPipe) id: number,
    @Body() addProdutoDto: AddProdutoDto,
  ) {
    return this.carrinhoService.addProduto(id, addProdutoDto.idProduto);
  }

  @Delete(':id/produtos/:idProduto')
  removeProduto(
    @Param('id', ParseIntPipe) id: number,
    @Param('idProduto', ParseIntPipe) idProduto: number,
  ) {
    return this.carrinhoService.removeProduto(id, idProduto);
  }
}