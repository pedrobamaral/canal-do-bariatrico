import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateDia0Dto } from './dto/create-dia0.dto';
import { UpdateDia0Dto } from './dto/update-dia0.dto';

@Injectable()
export class Dia0Service {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDia0Dto) {
    // Verifica se já existe um Dia0 para este usuário
    const existente = await this.prisma.dia0.findFirst({
      where: {
        idUsuario: dto.idUsuario,
      },
    });

    // Se já existe, retorna o existente
    if (existente) {
      return existente;
    }

    // Se não existe, cria um novo
    return this.prisma.dia0.create({
      data: {
        idUsuario: dto.idUsuario,
        quer_msg: dto.quer_msg,
        iniciou_medicamento: dto.iniciou_medicamento,
        dia_iniciar_med: dto.dia_iniciar_med,
        dia1: dto.dia1,
        dia0: dto.dia0,
      },
    });
  }

  async findAll() {
    return this.prisma.dia0.findMany({
      include: {
        usuario: true,
        ciclo: true,
      },
    });
  }

  async findOne(id: number) {
    const dia0 = await this.prisma.dia0.findUnique({
      where: { id },
      include: {
        usuario: true,
        ciclo: true,
      },
    });

    if (!dia0) {
      throw new NotFoundException('Dia0 não encontrado');
    }

    return dia0;
  }

  async findByCiclo(idCiclo: number) {
    const ciclo = await this.prisma.ciclo.findUnique({
      where: { id: idCiclo },
      include: {
        dia0: {
          include: {
            usuario: true,
            ciclo: true,
          },
        },
      },
    });

    if (!ciclo || !ciclo.dia0) {
      throw new NotFoundException('Dia0 não encontrado para este ciclo');
    }

    return ciclo.dia0;
  }


  async update(id: number, dto: UpdateDia0Dto) {
    await this.findOne(id);

    return this.prisma.dia0.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.dia0.delete({
      where: { id },
    });
  }
}
