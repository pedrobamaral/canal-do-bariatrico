import { PartialType } from '@nestjs/mapped-types';
import { CreateItemCarrinhoDto } from './create-item-carrinho.dto';
import { IsInt, Min } from 'class-validator';

export class UpdateItemCarrinhoDto extends PartialType(CreateItemCarrinhoDto) {
  @IsInt()
  @Min(1)
  quantidade: number;
}
