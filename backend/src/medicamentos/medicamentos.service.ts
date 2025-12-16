import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

@Injectable()
export class MedicamentosService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicamentoDto: CreateMedicamentoDto) {
    try {
      // Validação simples para garantir consistência na frequência
      if (!createMedicamentoDto.freq_dia && !createMedicamentoDto.freq_sem) {
         // Se nenhum for enviado, assume diário como padrão ou lança erro
         createMedicamentoDto.freq_dia = true; 
      }

      return await this.prisma.medicamentos.create({
        data: {
          ...createMedicamentoDto,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar o medicamento.');
    }
  }

  async findAll() {
    return this.prisma.medicamentos.findMany();
  }

  async findOne(id: number) {
    const medicamento = await this.prisma.medicamentos.findUnique({
      where: { id },
    });

    if (!medicamento) {
      throw new NotFoundException(`Medicamento com ID ${id} não encontrado.`);
    }

    return medicamento;
  }

  async update(id: number, updateMedicamentoDto: UpdateMedicamentoDto) {
    await this.findOne(id); // Garante que existe

    try {
      return await this.prisma.medicamentos.update({
        where: { id },
        data: updateMedicamentoDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar o medicamento.');
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.medicamentos.delete({
      where: { id },
    });
  }
}