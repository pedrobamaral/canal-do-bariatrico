import { Module } from '@nestjs/common';
import { SistemaService } from './sistema.service';
import { SistemaController } from './sistema.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [SistemaController],
  providers: [SistemaService, PrismaService],
})
export class SistemaModule {}
