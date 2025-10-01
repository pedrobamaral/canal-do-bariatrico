import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CarrinhoDto } from './dto/carrinho.dto';

@Injectable()
export class CarrinhoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CarrinhoDto) {
    const carrinho = await this.prisma.carrinho.create({
      data: {
        idUsuario: data.idUsuario ?? null,
        // conecta produtos existentes ao carrinho (se vierem IDs)
        ...(data.produtoIds?.length
          ? { produtos: { connect: data.produtoIds.map((id) => ({ id })) } }
          : {}),
      },
    });
    return carrinho;
  }

  async findAll() {
    return this.prisma.carrinho.findMany();
  }

  async getById(id: number) {
    const carrinho = await this.prisma.carrinho.findUnique({ where: { id } });
    if (!carrinho) throw new NotFoundException('Carrinho não encontrado');
    return carrinho;
  }

  async update(id: number, data: CarrinhoDto) {
    const exists = await this.prisma.carrinho.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Carrinho não encontrado');

    return this.prisma.carrinho.update({
      where: { id },
      data: {
        // atualiza apenas os campos enviados
        ...(data.idUsuario !== undefined ? { idUsuario: data.idUsuario } : {}),
        ...(data.produtoIds !== undefined
          ? { produtos: { set: data.produtoIds.map((pid) => ({ id: pid })) } }
          : {}),
      },
    });
  }

  async delete(id: number) {
    const exists = await this.prisma.carrinho.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Carrinho não encontrado');

    // desassocia produtos (evita erro de FK) e depois remove o carrinho
    await this.prisma.$transaction([
      this.prisma.produto.updateMany({
        where: { idCarrinho: id },
        data: { idCarrinho: null },
      }),
      this.prisma.carrinho.delete({ where: { id } }),
    ]);

    return { id, deleted: true };
  }
}
