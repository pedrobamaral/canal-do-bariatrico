import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { UsuarioModule } from './users/user.module';
import { ProdutoModule } from './produto/produto.module';

@Module({
  imports: [PrismaModule, UsuarioModule, ProdutoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
