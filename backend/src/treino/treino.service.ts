import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';

@Injectable()
export class TreinoService {
  constructor(private prisma: PrismaService) {}

  async create(createTreinoDto: CreateTreinoDto) {
    try {
      return await this.prisma.treino.create({
        data: {
          ...createTreinoDto,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar o treino.');
    }
  }

  async findAll() {
    return this.prisma.treino.findMany();
  }

  async findOne(id: number) {
    const treino = await this.prisma.treino.findUnique({
      where: { id },
    });

    if (!treino) {
      throw new NotFoundException(`Treino com ID ${id} não encontrado.`);
    }

    return treino;
  }

  async update(id: number, updateTreinoDto: UpdateTreinoDto) {
    await this.findOne(id); // Garante que existe

    try {
      return await this.prisma.treino.update({
        where: { id },
        data: updateTreinoDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar o treino.');
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Garante que existe

    return this.prisma.treino.delete({
      where: { id },
    });
  }
}