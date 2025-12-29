import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDietaDto } from './dto/create-dieta.dto';
import { UpdateDietaDto } from './dto/update-dieta.dto';

@Injectable()
export class DietaService {
  constructor(private prisma: PrismaService) {}

  async create(createDietaDto: CreateDietaDto) {
    try {
      return await this.prisma.dieta.create({
        data: {
          ...createDietaDto,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar a dieta.');
    }
  }

  async findAll() {
    return this.prisma.dieta.findMany();
  }

  async findOne(id: number) {
    const dieta = await this.prisma.dieta.findUnique({
      where: { id },
    });

    if (!dieta) {
      throw new NotFoundException(`Dieta com ID ${id} não encontrada.`);
    }

    return dieta;
  }

  async update(id: number, updateDietaDto: UpdateDietaDto) {
    await this.findOne(id); // Garante que existe

    try {
      return await this.prisma.dieta.update({
        where: { id },
        data: updateDietaDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar a dieta.');
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Garante que existe

    return this.prisma.dieta.delete({
      where: { id },
    });
  }
}