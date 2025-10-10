import {Injectable, NotFoundException, ConflictException, InternalServerErrorException} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCarrinhoDto } from './dto/create-carrinho.dto';

@Injectable()
export class CarrinhoService {
  constructor(private prisma: PrismaService) {}

  async create(createCarrinhoDto: CreateCarrinhoDto) {
    try {
      return await this.prisma.carrinho.create({
        data: {
          idUsuario: createCarrinhoDto.idUsuario,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' 
      ) {
        throw new ConflictException(
          'Este usuário já possui um carrinho de compras.',
        );
      }
      throw new InternalServerErrorException(
        'Não foi possível criar o carrinho.',
      );
    }
  }

  async findAll() {
    return this.prisma.carrinho.findMany({
      include: {
        usuario: { select: { id: true, nome: true } }, 
        produtos: true,
      },
    });
  }

  async findOne(id: number) {
    const carrinho = await this.prisma.carrinho.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nome: true } },
        produtos: true,
      },
    });

    if (!carrinho) {
      throw new NotFoundException(`Carrinho com ID #${id} não encontrado.`);
    }

    return carrinho;
  }

  async addProduto(id: number, idProduto: number) {
    await this.findOne(id); 
    return this.prisma.carrinho.update({
      where: { id },
      data: {
        produtos: {
          connect: {
            id: idProduto,
          },
        },
      },
      include: { produtos: true }, 
    });
  }

  async removeProduto(id: number, idProduto: number) {
    await this.findOne(id); 
    return this.prisma.carrinho.update({
      where: { id },
      data: {
        produtos: {
          disconnect: {
            id: idProduto,
          },
        },
      },
      include: { produtos: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.carrinho.delete({
      where: { id },
    });
  }
}