import { Module } from '@nestjs/common';
import { CicloService } from './ciclo.service';
import { CicloController } from './ciclo.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [CicloController],
  providers: [CicloService, PrismaService],
})
export class CicloModule {}
