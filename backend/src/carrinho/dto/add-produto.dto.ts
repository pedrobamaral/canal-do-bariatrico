import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddProdutoDto {
  @IsInt()
  @IsNotEmpty()
  idProduto: number;

  @IsInt()
  @Min(1)
  quantidade: number;
}