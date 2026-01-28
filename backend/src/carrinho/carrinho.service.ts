import {Injectable, NotFoundException, ConflictException, InternalServerErrorException} from '@nestjs/common';
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
      // Prisma client runtime types may not always be available during build/generation.
      // Fall back to checking the error code property to detect unique constraint violations.
      if ((error as any)?.code === 'P2002') {
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
        usuario: { select: {nome: true } }, 
        itemCarrinho: {include: {produto : {select : {nome: true, preco: true}}}}
      },
    });
  }

  async findOne(id: number) {
    const carrinho = await this.prisma.carrinho.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nome: true } },
        itemCarrinho: {include: {produto : {select : {id: true, nome: true, preco: true}}}}
      },
    });

    if (!carrinho) {
      throw new NotFoundException(`Carrinho com ID #${id} não encontrado.`);
    }

    return carrinho;
  }

  async addProduto(id: number, idProduto: number, quantidade: number) {
  await this.findOne(id); // Verifica se o carrinho existe
  const produtoExistente = await this.prisma.itemCarrinho.findFirst({
    where: {
      idCarrinho: id,
      idProduto: idProduto,
    },
  });

  //se jah tiver um produto, adiciona mais um
  if (produtoExistente) {
    return this.prisma.itemCarrinho.update({
      where: {
        idCarrinho_idProduto: { idCarrinho: id, idProduto: idProduto },
      },
      data: {
        quantidade: {
          increment: quantidade,
        },
      },
      include: { produto: true },
    });
  }

  // ou cria um novo item no carrinho
  return this.prisma.itemCarrinho.create({
    data: {
      idCarrinho: id,
      idProduto: idProduto,
      quantidade: quantidade,
    },
    include: { produto: true },
  });
}


async removeProduto(id: number, idProduto: number) {
  await this.findOne(id); // Verifica se o carrinho existe
  return this.prisma.itemCarrinho.delete({
    where: {
      idCarrinho_idProduto: { idCarrinho: id, idProduto: idProduto },
    },
  });
}


  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.carrinho.delete({
      where: { id },
    });
  }
}