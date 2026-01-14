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
    // garante 1 daily por ciclo e diaCiclo
    const existing = await this.prisma.daily.findUnique({
      where: { idDiaCiclo: dto.idDiaCiclo },
    });

    if (existing) {
      throw new BadRequestException(
        'Já existe um Daily registrado para este DiaCiclo',
      );
    }

    return this.prisma.daily.create({
      data: {
        idUsuario: dto.idUsuario,
        idCiclo: dto.idCiclo,
        idDiaCiclo: dto.idDiaCiclo,
        data: dto.data,
        hora_ans: dto.hora_ans,
        treino_check: dto.treino_check,
        dieta_check: dto.dieta_check,
        agua_check: dto.agua_check,
        mounjaro_check: dto.mounjaro_check,
        bioimpedancia_check: dto.bioimpedancia_check,
        refeicao_livre_check: dto.refeicao_livre_check,
        descanso_check: dto.descanso_check,
        consulta_check: dto.consulta_check,
        med_prescrita_check: dto.med_prescrita_check,
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
        diaciclo: true,
      },
    });

    if (!daily) {
      throw new NotFoundException('Daily não encontrado');
    }

    return daily;
  }

  async findByDiaCiclo(idDiaCiclo: number) {
    const daily = await this.prisma.daily.findUnique({
      where: { idDiaCiclo },
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
        idUsuario: dto.idUsuario,
        idCiclo: dto.idCiclo,
        idDiaCiclo: dto.idDiaCiclo,
        data: dto.data,
        hora_ans: dto.hora_ans,
        treino_check: dto.treino_check,
        dieta_check: dto.dieta_check,
        agua_check: dto.agua_check,
        mounjaro_check: dto.mounjaro_check,
        bioimpedancia_check: dto.bioimpedancia_check,
        refeicao_livre_check: dto.refeicao_livre_check,
        descanso_check: dto.descanso_check,
        consulta_check: dto.consulta_check,
        med_prescrita_check: dto.med_prescrita_check,
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
