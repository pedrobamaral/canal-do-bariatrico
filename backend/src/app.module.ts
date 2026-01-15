import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuarioModule } from './users/user.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { EnderecoModule } from './endereco/endereco.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ItemCarrinhoModule } from './item-carrinho/item-carrinho.module';
import { PontuacoesModule } from './pontuacoes/pontuacoes.module';
import { SistemaModule } from './sistema/sistema.module';
import { Dia0Module } from './dia0/dia0.module';
import { CicloModule } from './ciclo/ciclo.module';
import { DailyModule } from './daily/daily.module';
import { DiaCicloModule } from './diaciclo/diaciclo.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,}), PrismaModule, UsuarioModule, PagamentoModule, CarrinhoModule, EnderecoModule, AuthModule, ItemCarrinhoModule, PontuacoesModule, SistemaModule, Dia0Module, CicloModule, DailyModule, DiaCicloModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
