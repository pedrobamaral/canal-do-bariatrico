import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCicloDto } from './dto/create-ciclo.dto';
import { UpdateCicloDto } from './dto/update-ciclo.dto';

@Injectable()
export class CicloService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCicloDto) {
    // garante 1 ciclo ativo por usuário
    const cicloAtivo = await this.prisma.ciclo.findFirst({
      where: {
        idUsuario: dto.idUsuario,
        numCiclo: dto.numCiclo,
        data_atual: dto.data_atual,
      },
    });

    if (cicloAtivo) {
      throw new BadRequestException('Usuário já possui um ciclo ativo');
    }

    return this.prisma.ciclo.create({
      data: {
        idUsuario: dto.idUsuario,
        dia0Id: dto.dia0Id,

        numCiclo: dto.numCiclo,
        emCiclo: dto.emCiclo ?? false,
        ativoChatbot: dto.ativoChatbot ?? false,

        med_prescrita: dto.med_prescrita,
        mounjaro: dto.mounjaro,
        treino: dto.treino,
        bioimpedancia: dto.bioimpedancia,
        consulta: dto.consulta,
        descanso: dto.descanso,
        refeicao_livre: dto.refeicao_livre,

        cumpriu: dto.cumpriu ?? 0,
        pontos: dto.pontos ?? 0,

        data_atual: dto.data_atual,
        dia_ciclo: dto.dia_ciclo,
      },
    });

  }

  async findAll() {
    return this.prisma.ciclo.findMany({
      include: {
        usuario: true,
        dia0: true,
        daily: true,
      },
    });
  }

  async findOne(id: number) {
    const ciclo = await this.prisma.ciclo.findUnique({
      where: { id },
      include: {
        usuario: true,
        dia0: true,
        daily: true,
      },
    });

    if (!ciclo) {
      throw new NotFoundException('Ciclo não encontrado');
    }

    return ciclo;
  }

  async findByUsuario(idUsuario: number) {
    const ciclo = await this.prisma.ciclo.findFirst({
      where: { idUsuario },
      include: {
        dia0: true,
        daily: true,
      },
      orderBy: { id: 'desc' },
    });

    if (!ciclo) {
      throw new NotFoundException('Ciclo não encontrado para este usuário');
    }

    return ciclo;
  }

  async update(id: number, dto: UpdateCicloDto) {
    await this.findOne(id);

    return this.prisma.ciclo.update({
      where: { id },
      data: dto,
    });
  }

  async finalizarCiclo(id: number) {
    await this.findOne(id);

    return this.prisma.ciclo.update({
      where: { id },
      data: {
        emCiclo: false,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.ciclo.delete({
      where: { id },
    });
  }
}
