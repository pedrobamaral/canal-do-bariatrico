import {
  IsString, IsEmail, IsNotEmpty , IsOptional, IsBoolean, MinLength, IsEnum, IsNumber, IsDateString, } from 'class-validator';
import { Sexo } from '@prisma/client';

export class CreateUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  senha: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsBoolean()
  admin?: boolean;

  //Projeto Vidale

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEnum(Sexo)
  sexo?: Sexo;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsNumber()
  altura?: number;

  @IsOptional()
  @IsDateString()
  nascimento?: Date;

  @IsOptional()
  @IsNumber()
  massa_magra?: number;

  @IsOptional()
  @IsNumber()
  meta?: number;
}
