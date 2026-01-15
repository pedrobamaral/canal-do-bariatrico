import { Module } from '@nestjs/common';
import { DiaCicloService } from './diaciclo.service';
import { DiaCicloController } from './diaciclo.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [DiaCicloController],
  providers: [DiaCicloService, PrismaService],
})
export class DiaCicloModule {}
