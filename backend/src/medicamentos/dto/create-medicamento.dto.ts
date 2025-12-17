import { IsInt, IsNotEmpty, IsString, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateMedicamentoDto {
  @IsInt()
  @IsNotEmpty()
  idSistema: number;

  @IsString()
  @IsNotEmpty()
  nome: string; // Pode ser o nome do medicamento ou suplemento

  @IsString()
  @IsOptional()
  concentracao?: string;

  @IsBoolean()
  @IsOptional()
  freq_sem?: boolean;

  @IsBoolean()
  @IsOptional()
  freq_dia?: boolean;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  qtnd_freq: number;

  @IsString()
  @IsOptional()
  medico?: string;

  @IsString()
  @IsOptional()
  insta_medico?: string;
}