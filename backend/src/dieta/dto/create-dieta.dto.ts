import { IsInt, IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDietaDto {
  @IsInt()
  @IsNotEmpty()
  idsistema: number; // Assumindo que a dieta sempre pertence a um sistema/usuário

  @IsInt()
  @IsNotEmpty()
  freq: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number) // Garante que venha como número
  caloria_dia: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  hidratacao: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  carb: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  prot: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  gord: number;

  @IsString()
  @IsNotEmpty()
  nutri: string;

  @IsString()
  @IsNotEmpty()
  insta_nutri: string;
}