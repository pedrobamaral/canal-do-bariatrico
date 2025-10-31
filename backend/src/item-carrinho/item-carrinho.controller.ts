import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ItemCarrinhoService } from './item-carrinho.service';
import { UpdateItemCarrinhoDto } from './dto/update-item-carrinho.dto';

@Controller('carrinhos/:carrinhoId/itens')
export class ItemCarrinhoController {
  constructor(private readonly service: ItemCarrinhoService) {}

  @Get()
  list(@Param('carrinhoId') carrinhoId: number) {
    return this.service.list(+carrinhoId);
  }

  @Patch(':produtoId')
  updateQuantidade(
    @Param('carrinhoId') carrinhoId: number,
    @Param('produtoId') produtoId: number,
    @Body() dto: UpdateItemCarrinhoDto,
  ) {
    return this.service.updateQuantidade(+carrinhoId, +produtoId, dto);
  }

  @Delete(':produtoId')
  remove(
    @Param('carrinhoId') carrinhoId: number,
    @Param('produtoId') produtoId: number,
  ) {
    return this.service.remove(+carrinhoId, +produtoId);
  }

  @Delete()
  clear(@Param('carrinhoId') carrinhoId: number) {
    return this.service.clear(+carrinhoId);
  }
}
