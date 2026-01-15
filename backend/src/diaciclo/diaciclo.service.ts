import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateDiaCicloDto } from './dto/create-diaciclo.dto';
import { UpdateDiaCicloDto } from './dto/update-diaciclo.dto';

@Injectable()
export class DiaCicloService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDiaCicloDto) {
    // Garante 1 DiaCiclo por idCiclo e dia_ciclo
    const existing = await this.prisma.diaCiclo.findFirst({
      where: {
        idCiclo: dto.idCiclo,
        dia_ciclo: dto.dia_ciclo,
      },
    });
    if (existing) {
      throw new BadRequestException('Já existe um DiaCiclo para este ciclo e dia.');
    }
    return this.prisma.diaCiclo.create({
      data: {
        idUsuario: dto.idUsuario,
        idCiclo: dto.idCiclo,
        dia0Id: dto.dia0Id,
        emCiclo: dto.emCiclo ?? false,
        ativoChatbot: dto.ativoChatbot ?? false,
        tem_med_prescrita: dto.tem_med_prescrita ?? false,
        tem_mounjaro: dto.tem_mounjaro ?? false,
        tem_treino: dto.tem_treino ?? false,
        tem_dieta: dto.tem_dieta ?? false,
        tem_agua: dto.tem_agua ?? false,
        tem_bioimpedancia: dto.tem_bioimpedancia ?? false,
        tem_consulta: dto.tem_consulta ?? false,
        tem_descanso: dto.tem_descanso ?? false,
        tem_refeicao_livre: dto.tem_refeicao_livre ?? false,
        cumpriu: dto.cumpriu ?? 0,
        pontos: dto.pontos ?? 0,
        data_dia: dto.data_dia,
        dia_ciclo: dto.dia_ciclo ?? 0,
      },
    });
  }

  async findAll() {
    return this.prisma.diaCiclo.findMany();
  }

  async findOne(id: number) {
    const diaCiclo = await this.prisma.diaCiclo.findUnique({ where: { id } });
    if (!diaCiclo) {
      throw new NotFoundException('DiaCiclo não encontrado');
    }
    return diaCiclo;
  }

  async findByCiclo(idCiclo: number) {
    return this.prisma.diaCiclo.findMany({ where: { idCiclo } });
  }

  async update(id: number, dto: UpdateDiaCicloDto) {
    await this.findOne(id);
    return this.prisma.diaCiclo.update({
      where: { id },
      data: {
        emCiclo: dto.emCiclo,
        ativoChatbot: dto.ativoChatbot,
        tem_med_prescrita: dto.tem_med_prescrita,
        tem_mounjaro: dto.tem_mounjaro,
        tem_treino: dto.tem_treino,
        tem_dieta: dto.tem_dieta,
        tem_agua: dto.tem_agua,
        tem_bioimpedancia: dto.tem_bioimpedancia,
        tem_consulta: dto.tem_consulta,
        tem_descanso: dto.tem_descanso,
        tem_refeicao_livre: dto.tem_refeicao_livre,
        cumpriu: dto.cumpriu,
        pontos: dto.pontos,
        data_dia: dto.data_dia,
        dia_ciclo: dto.dia_ciclo,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.diaCiclo.delete({ where: { id } });
  }
}
