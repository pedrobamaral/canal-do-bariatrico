import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './database/prisma.module';
import { UsuarioModule } from './users/user.module';
import { ProdutoModule } from './produto/produto.module';
import { PagamentoModule } from './pagamento/pagamento.module';

@Module({
  imports: [PrismaModule, UsuarioModule, ProdutoModule, PagamentoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
