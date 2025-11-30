import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { createProdutoDto } from './dto/createprodutodto.dto';
import { UpdateProdutoDto } from './dto/updateproduto.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProdutoService {
  constructor(private prisma: PrismaService) {}

  async create(data: createProdutoDto) {
    const produto = await this.prisma.produto.findFirst({
      where: {nome: data.nome}
    })
    if (produto) {
      throw new ConflictException(`Produto "${data.nome}" já existe`);
    }

    return await this.prisma.produto.create({data: {
      nome: data.nome,
      descricao: data.descricao,
      img: data.img ?? null,
      imgNutricional: data.imgNutricional ?? null,
      preco: new Prisma.Decimal(data.preco),
    }});
  }

  async findAll() {
    return this.prisma.produto.findMany();
  }

  async getById(id: number) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) throw new NotFoundException('Produto não encontrado');
    return produto;
  }

  async update(id: number, data: UpdateProdutoDto) {
    const one = await this.prisma.produto.findUnique({
      where: {id},
    })
    if (!one) {
      throw new Error(`Produto com id ${id} nao encontrado`)
    }

    return this.prisma.produto.update({where: {id}, data:data})
  }

  async delete(id: number) {
    const exists = await this.prisma.produto.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Produto não encontrado');

    return this.prisma.produto.delete({ where: { id } });
  }
}
