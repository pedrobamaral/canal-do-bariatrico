import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSistemaDto } from './dto/create-sistema.dto';
import { UpdateSistemaDto } from './dto/update-sistema.dto';

@Injectable()
export class SistemaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSistemaDto) {
    // garante 1 sistema por usuário
    const existente = await this.prisma.sistema.findUnique({
      where: { idUsuario: dto.idUsuario },
    });

    if (existente) {
      throw new BadRequestException('Usuário já possui um sistema');
    }

    return this.prisma.sistema.create({
      data: {
        idUsuario: dto.idUsuario,
      },
    });
  }

  async findAll() {
    return this.prisma.sistema.findMany({
      include: {
        usuario: true,
        medicamentos: true,
        dieta: true,
        treino: true,
      },
    });
  }

  async findOne(id: number) {
    const sistema = await this.prisma.sistema.findUnique({
      where: { id },
      include: {
        usuario: true,
        medicamentos: true,
        dieta: true,
        treino: true,
      },
    });

    if (!sistema) {
      throw new NotFoundException('Sistema não encontrado');
    }

    return sistema;
  }

  async findByUsuario(idUsuario: number) {
    const sistema = await this.prisma.sistema.findUnique({
      where: { idUsuario },
      include: {
        medicamentos: true,
        dieta: true,
        treino: true,
      },
    });

    if (!sistema) {
      throw new NotFoundException('Sistema não encontrado para este usuário');
    }

    return sistema;
  }

  async update(id: number, dto: UpdateSistemaDto) {
    await this.findOne(id);

    return this.prisma.sistema.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.sistema.delete({
      where: { id },
    });
  }
}
