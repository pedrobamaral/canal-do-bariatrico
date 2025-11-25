import { Module } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { EnderecoController } from './endereco.controller';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EnderecoController],
  providers: [EnderecoService, PrismaService],
  exports: [EnderecoService]
})
export class EnderecoModule {}
