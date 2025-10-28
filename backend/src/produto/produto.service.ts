import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ProdutoDto } from './dto/produto.dto';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  async create(data: ProdutoDto) {
    const produto = await this.prisma.produto.create({
      data: {
        Nome: data.Nome,
        Imagem: data.Imagem,
        descricao: data.descricao,
        preco: data.preco,
        // se quiser permitir atrelar a um carrinho já existente:
        ...(data.idCarrinho ? { idCarrinho: data.idCarrinho } : {}),
      },
    });
    return produto;
  }

  async findAll() {
    return this.prisma.produto.findMany();
  }

  async getById(id: number) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async update(id: number, data: ProdutoDto) {
    const exists = await this.prisma.produto.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Produto não encontrado');

    return this.prisma.produto.update({
      where: { id },
      data: {
        // atualiza apenas os campos enviados
        ...(data.Nome !== undefined ? { Nome: data.Nome } : {}),
        ...(data.Imagem !== undefined ? { Imagem: data.Imagem } : {}),
        ...(data.descricao !== undefined ? { descricao: data.descricao } : {}),
        ...(data.preco !== undefined ? { preco: data.preco } : {}),
        ...(data.idCarrinho !== undefined ? { idCarrinho: data.idCarrinho } : {}),
      },
    });
  }

  async delete(id: number) {
    const exists = await this.prisma.produto.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Produto não encontrado');

    return this.prisma.produto.delete({ where: { id } });
  }
}
