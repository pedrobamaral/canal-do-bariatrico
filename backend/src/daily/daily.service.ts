import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateDailyDto } from './dto/create-daily.dto';
import { UpdateDailyDto } from './dto/update-daily.dto';

@Injectable()
export class DailyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDailyDto) {
    // garante 1 daily por ciclo
    const existing = await this.prisma.daily.findUnique({
      where: { idCiclo: dto.idCiclo },
    });

    if (existing) {
      throw new BadRequestException(
        'Já existe um Daily registrado para este ciclo',
      );
    }

    return this.prisma.daily.create({
      data: {
        idCiclo: dto.idCiclo,
        data: dto.data ?? new Date(),
        hora_ans: dto.hora_ans,

        agua_check: dto.agua_check,
        dieta_check: dto.dieta_check,
        treino_check: dto.treino_check,
        mounjaro_check: dto.mounjaro_check,
        bioimpedancia_check: dto.bioimpedancia_check,
        refeicao_livre_check: dto.refeicao_livre_check,
        descanso_check: dto.descanso_check,
        consulta_check: dto.consulta_check,
      },
    });
  }

  async findAll() {
    return this.prisma.daily.findMany({
      include: {
        ciclo: true,
      },
    });
  }

  async findOne(id: number) {
    const daily = await this.prisma.daily.findUnique({
      where: { id },
      include: {
        ciclo: true,
      },
    });

    if (!daily) {
      throw new NotFoundException('Daily não encontrado');
    }

    return daily;
  }

  async findByCiclo(idCiclo: number) {
    const daily = await this.prisma.daily.findUnique({
      where: { idCiclo },
    });

    if (!daily) {
      throw new NotFoundException(
        'Daily não encontrado para este ciclo',
      );
    }

    return daily;
  }

  async update(id: number, dto: UpdateDailyDto) {
    await this.findOne(id);

    return this.prisma.daily.update({
      where: { id },
      data: {
        ...dto,
        hora_ans: dto.hora_ans ?? new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.daily.delete({
      where: { id },
    });
  }
}
