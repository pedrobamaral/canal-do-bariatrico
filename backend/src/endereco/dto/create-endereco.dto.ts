import { PartialType } from "@nestjs/mapped-types";
import { EnderecoEntity } from "../entities/endereco.entity";
import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateEnderecoDto extends PartialType(EnderecoEntity){
    @IsNotEmpty({message : "O campo endereco está vazio"})
    @IsString({message : "Campo não aceita apenas números"})
    endereco: string

    @IsNotEmpty({message : "O campo complemento está vazio"})
    complemento: string;

    @IsNotEmpty({message : "O campo CEP está vazio"})
    CEP: string;
}
