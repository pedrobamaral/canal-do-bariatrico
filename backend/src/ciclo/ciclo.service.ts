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
    // Verifica se já existe um ciclo ativo para este usuário
    const cicloAtivo = await this.prisma.ciclo.findFirst({
      where: {
        idUsuario: dto.idUsuario,
        ativoCiclo: true,
      },
    });

    // Se já existe um ciclo ativo, retorna ele
    if (cicloAtivo) {
      return cicloAtivo;
    }

    return this.prisma.ciclo.create({
      data: {
        idUsuario: dto.idUsuario,
        dia0Id: dto.dia0Id,
        numCiclo: dto.numCiclo,

        ativoCiclo: dto.ativoCiclo ?? false,

        med_prescrita: dto.med_prescrita ?? false,
        freq_med_prescrita: dto.freq_med_prescrita ?? 0,
        mounjaro: dto.mounjaro ?? false,
        treino: dto.treino ?? false,
        dieta: dto.dieta ?? false,
        agua: dto.agua ?? false,
        bioimpedancia: dto.bioimpedancia ?? false,
        consulta: dto.consulta ?? false,

        cumpriu_atual: dto.cumpriu_atual ?? 0,
        respSim: dto.respSim ?? 0,
        respNao: dto.respNao ?? 0,
        pontos_atual: dto.pontos_atual ?? 0,
        maxPontos: dto.maxPontos ?? 0,

        dia_ciclo_atual: dto.dia_ciclo_atual ?? 0,
      },
    });

  }

  async findAll() {
    return this.prisma.ciclo.findMany({
      include: {
        usuario: true,
        dia0: true,
        dailys: true,
      },
    });
  }

  async findOne(id: number) {
    const ciclo = await this.prisma.ciclo.findUnique({
      where: { id },
      include: {
        usuario: true,
        dia0: true,
        dailys: true,
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
        dailys: true,
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

    // Garante que apenas campos válidos do modelo sejam atualizados
    return this.prisma.ciclo.update({
      where: { id },
      data: {
        numCiclo: dto.numCiclo,
        ativoCiclo: dto.ativoCiclo,

        med_prescrita: dto.med_prescrita,
        freq_med_prescrita: dto.freq_med_prescrita,
        mounjaro: dto.mounjaro,
        treino: dto.treino,
        dieta: dto.dieta,
        agua: dto.agua,
        bioimpedancia: dto.bioimpedancia,
        consulta: dto.consulta,

        cumpriu_atual: dto.cumpriu_atual,
        respSim: dto.respSim,
        respNao: dto.respNao,
        pontos_atual: dto.pontos_atual,
        maxPontos: dto.maxPontos,

        dia_ciclo_atual: dto.dia_ciclo_atual,
      },
    });
  }

  async finalizarCiclo(id: number) {
    await this.findOne(id);

    return this.prisma.ciclo.update({
      where: { id },
      data: {
        ativoCiclo: false,
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
