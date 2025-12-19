import { Module } from '@nestjs/common';
import { PontuacoesService } from './pontuacoes.service';
import { PontuacoesController } from './pontuacoes.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [PontuacoesController],
  providers: [PontuacoesService, PrismaService],
})
export class PontuacoesModule {}
