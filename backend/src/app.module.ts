import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuarioModule } from './users/user.module';
import { ProdutoModule } from './produto/produto.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { EnderecoModule } from './endereco/endereco.module';
import { ItemCarrinhoModule } from './item-carrinho/item-carrinho.module';

@Module({
  imports: [PrismaModule, UsuarioModule, ProdutoModule, PagamentoModule, CarrinhoModule, EnderecoModule, ItemCarrinhoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
