import { PartialType } from '@nestjs/mapped-types';
import { CreatePontuacoeDto } from './create-pontuacoe.dto';

export class UpdatePontuacoeDto extends PartialType(CreatePontuacoeDto) {}
