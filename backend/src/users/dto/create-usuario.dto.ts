import { IsString, IsEmail, IsNotEmpty, IsOptional, IsBoolean, MinLength } from 'class-validator';

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
}