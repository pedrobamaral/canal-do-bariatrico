import { Module } from '@nestjs/common';
import { ItemCarrinhoService } from './item-carrinho.service';
import { ItemCarrinhoController } from './item-carrinho.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ItemCarrinhoController],
  providers: [ItemCarrinhoService, PrismaService],
  exports: [ItemCarrinhoService]
})
export class ItemCarrinhoModule {}
