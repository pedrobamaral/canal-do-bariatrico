import { IsNotEmpty, IsInt, IsString, IsNumber, Min } from 'class-validator';

export class CreatePagamentoDto {
  @IsInt()
  @IsNotEmpty()
  carrinhoId: number;

  @IsString()
  @IsNotEmpty()
  metodo: string;

  @IsNumber()
  @Min(0)
  valor: number;
}