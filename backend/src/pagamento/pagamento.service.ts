import {Injectable, NotFoundException, ConflictException, InternalServerErrorException} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

@Injectable()
export class PagamentoService {
  constructor(private prisma: PrismaService) {}

  async create(createPagamentoDto: CreatePagamentoDto) {
    try {
      return await this.prisma.pagamento.create({
        data: createPagamentoDto,
      });
    } catch (error) {
      if ((error as any)?.code === 'P2002') {
        throw new ConflictException(
          'Já existe um pagamento registrado para este carrinho.',
        );
      }
      throw new InternalServerErrorException(
        'Não foi possível criar o pagamento.',
      );
    }
  }

  async findAll() {
    return this.prisma.pagamento.findMany();
  }

  async findOne(id: number) {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: { id },
    });

    if (!pagamento) {
      throw new NotFoundException(`Pagamento com ID #${id} não encontrado.`);
    }

    return pagamento;
  }

  async update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    await this.findOne(id);

    try {
      return await this.prisma.pagamento.update({
        where: { id },
        data: updatePagamentoDto,
      });
    } catch (error) {
      if ((error as any)?.code === 'P2002') {
        throw new ConflictException(
          'O carrinhoId informado já está associado a outro pagamento.',
        );
      }
      throw new InternalServerErrorException(
        'Não foi possível atualizar o pagamento.',
      );
    }
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.pagamento.delete({
      where: { id },
    });
  }
}