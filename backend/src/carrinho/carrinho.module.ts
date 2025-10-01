import { Module } from '@nestjs/common';
import { CarrinhoController } from './carrinho.controller';
import { CarrinhoService } from './carrinho.service';
import { PrismaService } from 'src/database/prisma.service'; // mesmo import do produto

@Module({
  controllers: [CarrinhoController],
  providers: [CarrinhoService, PrismaService],
  exports: [CarrinhoService],
})
export class CarrinhoModule {}
