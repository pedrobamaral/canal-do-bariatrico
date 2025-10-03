import { Module } from '@nestjs/common';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [ProdutoController],
  providers: [ProdutoService, PrismaService],
  exports: [ProdutoService],
})
export class ProdutoModule {}
