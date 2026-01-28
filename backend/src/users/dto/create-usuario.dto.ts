import {
  IsString, IsEmail, IsNotEmpty , IsOptional, IsBoolean, MinLength, IsNumber, IsDateString, } from 'class-validator';

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
  @IsString()
  foto?: string;

  @IsOptional()
  @IsString()
  sexo?: string;

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
