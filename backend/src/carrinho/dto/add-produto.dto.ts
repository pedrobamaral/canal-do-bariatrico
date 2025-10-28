import { IsInt, IsNotEmpty } from 'class-validator';

export class AddProdutoDto {
  @IsInt()
  @IsNotEmpty()
  idProduto: number;
}