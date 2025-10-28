import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuarioModule } from './users/user.module';
import { ProdutoModule } from './produto/produto.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { EnderecoModule } from './endereco/endereco.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,}), PrismaModule, UsuarioModule, ProdutoModule, PagamentoModule, CarrinhoModule, EnderecoModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
