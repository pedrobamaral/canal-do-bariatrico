import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsOptional } from 'class-validator';
import { CreatePagamentoDto } from './create-pagamento.dto';

export class UpdatePagamentoDto extends PartialType(CreatePagamentoDto) {
  @IsDate()
  @IsOptional()
  dataConfirmado?: Date;
}