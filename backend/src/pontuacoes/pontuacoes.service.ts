import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePontuacoeDto } from './dto/create-pontuacoe.dto';
import { UpdatePontuacoeDto } from './dto/update-pontuacoe.dto';

@Injectable()
export class PontuacoesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePontuacoeDto) {
    return this.prisma.pontuacoes.create({
      data: {
        numCiclo: dto.numCiclo,
        respSim: dto.respSim,
        respNao: dto.respNao,
        pontos: dto.pontos,
        porcentagem: dto.porcentagem,
        maxPontos: dto.maxPontos,
        usuarioId: dto.usuarioId,
      },
    });
  }

  async findAll() {
    return this.prisma.pontuacoes.findMany({
      include: {
        usuario: true,
      },
    });
  }

  async findOne(id: number) {
    const pontuacao = await this.prisma.pontuacoes.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!pontuacao) {
      throw new NotFoundException('Pontuação não encontrada');
    }

    return pontuacao;
  }

  async update(id: number, dto: UpdatePontuacoeDto) {
    await this.findOne(id);

    return this.prisma.pontuacoes.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.pontuacoes.delete({
      where: { id },
    });
  }
}
