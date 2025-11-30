import { PartialType } from "@nestjs/mapped-types";
import { ProdutoEntity } from "../entities/produto.entity";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class createProdutoDto extends PartialType(ProdutoEntity) {
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsString()
    descricao: string;

    @IsString()
    img?: string | null | undefined;

    @IsString()
    imgNutricional?: string | null | undefined;

    @Type(() => Number)               
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    preco: number;
}