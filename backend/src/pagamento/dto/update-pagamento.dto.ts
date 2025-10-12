import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePagamentoDto } from './create-pagamento.dto';

export class UpdatePagamentoDto extends PartialType(CreatePagamentoDto) {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dataConfirmado?: Date;
}