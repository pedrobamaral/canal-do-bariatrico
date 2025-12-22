import { IsInt, IsNotEmpty, IsString, IsOptional, Max, Min } from 'class-validator';

export class CreateTreinoDto {
  @IsInt()
  @IsNotEmpty()
  idSistema: number;

  @IsString()
  @IsOptional() 
  pdf_url?: string;

  @IsInt()
  @Min(0)
  @Max(7) // Garante que seja entre 0 e 7 dias
  @IsNotEmpty()
  freq_musc: number;

  @IsInt()
  @Min(0)
  @Max(7)
  @IsNotEmpty()
  freq_aero: number;

  @IsString()
  @IsNotEmpty()
  personal: string;

  @IsString()
  @IsNotEmpty()
  insta_personal: string;
}