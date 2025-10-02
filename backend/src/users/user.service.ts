import {Injectable, NotFoundException, ConflictException, InternalServerErrorException,} from '@nestjs/common'; 
import { PrismaService } from '../database/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
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

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: parseInt(id, 10) },
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

  async findByEmail(email: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com e-mail ${email} não encontrado.`);
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);
    const { endereco, ...restDto } = updateUsuarioDto;
    let data: any = { ...restDto };

    if (endereco) {
      data.endereco = {
        update: {
          rua: endereco.rua,
          numero: endereco.numero,
          cidade: endereco.cidade,
          estado: endereco.estado,
          cep: endereco.cep,
        },
      };
    }

    const usuarioAtualizado = await this.prisma.usuario.update({
      where: { id: parseInt(id, 10) },
      data,
    });
    
    const { senha, ...result } = usuarioAtualizado;
    return result;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.usuario.delete({
      where: { id: parseInt(id, 10) },
    });
    
    return;
  }
}