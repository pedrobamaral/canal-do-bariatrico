import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class RegisterDto {
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

  @IsBoolean()
  @IsOptional()
  admin?: boolean; 
}