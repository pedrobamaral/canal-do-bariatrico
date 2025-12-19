import { Module } from '@nestjs/common';
import { Dia0Service } from './dia0.service';
import { Dia0Controller } from './dia0.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [Dia0Controller],
  providers: [Dia0Service, PrismaService],
})
export class Dia0Module {}
