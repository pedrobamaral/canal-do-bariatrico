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

  async createByUsuario(usuarioId: number, data: any) {
    try {
      // Primeiro, busca ou cria o Sistema do usuário
      let sistema = await this.prisma.sistema.findUnique({
        where: { idUsuario: usuarioId },
      });

      if (!sistema) {
        sistema = await this.prisma.sistema.create({
          data: { idUsuario: usuarioId },
        });
      }

      // Mapeia a frequência - agora data.frequencia é um número (intervalo em dias)
      let freq_sem = false;
      let freq_dia = false;
      let qtnd_freq = data.frequencia || 1; // Usa o valor numérico diretamente

      // Define se é semanal ou diário baseado no intervalo
      if (qtnd_freq === 7) {
        freq_sem = true;
        freq_dia = false;
      } else {
        freq_dia = true;
        freq_sem = false;
      }

      // Cria o medicamento associado ao sistema
      const medicamento = await this.prisma.medicamentos.create({
        data: {
          idSistema: sistema.id,
          nome: data.nome || 'Não informado',
          freq_sem,
          freq_dia,
          qtnd_freq,
          medico: data.nomeMedico || null,
          insta_medico: data.instagramMedico || null,
        },
      });

      // Atualiza o ciclo ativo do usuário com a frequência do medicamento
      const cicloAtivo = await this.prisma.ciclo.findFirst({
        where: {
          idUsuario: usuarioId,
          ativoCiclo: true,
        },
      });

      if (cicloAtivo) {
        await this.prisma.ciclo.update({
          where: { id: cicloAtivo.id },
          data: {
            med_prescrita: true,
            freq_med_prescrita: qtnd_freq, // Salva o intervalo em dias
          },
        });
      }

      return medicamento;
    } catch (error) {
      console.error('Erro ao criar medicamento por usuário:', error);
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