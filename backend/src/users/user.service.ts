import {Injectable, NotFoundException, ConflictException, InternalServerErrorException,} from '@nestjs/common'; 
import { PrismaService } from '../database/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Prisma, Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: Prisma.UsuarioCreateInput) {
    const emailEmUso = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (emailEmUso) {
      throw new ConflictException('Este endereço de e-mail já está em uso.');
    }

    try {
      const novoUsuario = await this.prisma.usuario.create({
        data: {
          nome: createUsuarioDto.nome,
          email: createUsuarioDto.email,
          senha: createUsuarioDto.senha,
          admin: createUsuarioDto.admin || false,
        },
      });

      const { senha, ...result } = novoUsuario;
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Não foi possível criar o usuário.');
    }
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        dataCriacao: true,
      },
    });
  }

  async findOne(id: string | number) {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,  
        nome: true,
        email: true,
        dataCriacao: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID #${id} não encontrado.`);
    }

    return usuario;
  }

  async findByEmailWithPassword(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async update(id: number | string, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id); 

    if (updateUsuarioDto.senha && typeof updateUsuarioDto.senha === 'string') {
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    try {
      const usuarioAtualizado = await this.prisma.usuario.update({
        where: { id: typeof id === 'string' ? parseInt(id, 10) : id },
        data: updateUsuarioDto,
      });

      const { senha, ...result } = usuarioAtualizado; 
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Não foi possível atualizar o usuário.');
    }
  }

  async remove(id: number | string) {
    await this.findOne(id); 
    return this.prisma.usuario.delete({
      where: { id: typeof id === 'string' ? parseInt(id, 10) : id },
    });
  }
}