import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { UsuarioService } from './user.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('usuarios') 
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      const result = await this.usuarioService.create(createUsuarioDto);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    try {
      const result = await this.usuarioService.findAll();
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    try {
      const result = await this.usuarioService.findOne(id);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto,) {
    try {
      const result = await this.usuarioService.update(+id, updateUsuarioDto);
      return { status: 'sucesso', data: result };
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async remove(@Param('id') id: string) {
    try {
      await this.usuarioService.remove(id);
    } catch (error) {
      return { status: 'erro', message: error.message };
    }
  }
}