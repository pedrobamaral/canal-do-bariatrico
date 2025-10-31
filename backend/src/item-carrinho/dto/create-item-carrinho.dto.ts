import { IsInt, Min } from "class-validator";

export class CreateItemCarrinhoDto {
  @IsInt()
  produtoId: number;

  @IsInt()
  @Min(1)
  quantidade = 1;
}
