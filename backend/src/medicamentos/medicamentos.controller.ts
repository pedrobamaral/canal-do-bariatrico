import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

@Controller('medicamentos')
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) {}

  @Post()
  async create(@Body() createMedicamentoDto: CreateMedicamentoDto) {
    try {
      const result = await this.medicamentosService.create(createMedicamentoDto);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Post('usuario/:usuarioId')
  async createByUsuario(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body() data: any,
  ) {
    try {
      const result = await this.medicamentosService.createByUsuario(usuarioId, data);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.medicamentosService.findAll();
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.medicamentosService.findOne(id);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateMedicamentoDto: UpdateMedicamentoDto) {
    try {
      const result = await this.medicamentosService.update(id, updateMedicamentoDto);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.medicamentosService.remove(id);
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }
}