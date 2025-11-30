import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateItemCarrinhoDto } from './dto/update-item-carrinho.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ItemCarrinhoService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /carrinhos/:carrinhoId/itens
  async list(carrinhoId: number) {
    const itens = await this.prisma.itemCarrinho.findMany({
      where: { idCarrinho: carrinhoId },
      include: { produto: { select: { id: true, nome: true, preco: true, img: true } } },
    });

    const total = itens.reduce((acc, it) => acc + Number(it.produto.preco) * it.quantidade, 0);
    return { itens, total };
  }

  // PATCH /carrinhos/:carrinhoId/itens/:produtoId
  async updateQuantidade(carrinhoId: number, produtoId: number, dto: UpdateItemCarrinhoDto) {
    const exists = await this.prisma.itemCarrinho.findUnique({
      where: { idCarrinho_idProduto: { idCarrinho: carrinhoId, idProduto: produtoId } },
      select: { idCarrinho: true },
    });
    if (!exists) throw new NotFoundException('Item não encontrado no carrinho');

    return this.prisma.itemCarrinho.update({
      where: { idCarrinho_idProduto: { idCarrinho: carrinhoId, idProduto: produtoId } },
      data: { quantidade: dto.quantidade },
    });
  }

  // DELETE /carrinhos/:carrinhoId/itens/:produtoId
  async remove(carrinhoId: number, produtoId: number) {
    return this.prisma.itemCarrinho.delete({
      where: { idCarrinho_idProduto: { idCarrinho: carrinhoId, idProduto: produtoId } },
    });
  }

  // DELETE /carrinhos/:carrinhoId/itens
  async clear(carrinhoId: number) {
    await this.prisma.itemCarrinho.deleteMany({ where: { idCarrinho: carrinhoId } });
    return { ok: true };
  }
}
