import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCarrinhoDto {
  @IsInt()
  @IsNotEmpty()
  idUsuario: number;
}