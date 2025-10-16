import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';

@Controller('endereco')
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @Post()
  async create(@Body() createEnderecoDto: CreateEnderecoDto) {
    return this.enderecoService.create(createEnderecoDto);
  }

  @Get()
  async findAll() {
    return this.enderecoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.enderecoService.findOne(+id);
  }

  @Get(':CEP')
  async findByCEP(@Param('CEP') CEP: string) {
    return this.enderecoService.findByCEP(CEP);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEnderecoDto: UpdateEnderecoDto) {
    // COLOCAR USERPAYLOAD COM AUTH
    return this.enderecoService.update(+id, updateEnderecoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // COLOCAR USERPAYLOAD COM AUTH
    return this.enderecoService.remove(+id);
  }
}
