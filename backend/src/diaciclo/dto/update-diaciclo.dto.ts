import { PartialType } from '@nestjs/mapped-types';
import { CreateDiaCicloDto } from './create-diaciclo.dto';

export class UpdateDiaCicloDto extends PartialType(CreateDiaCicloDto) {}
