import { PartialType } from '@nestjs/mapped-types';
import { CreateDia0Dto } from './create-dia0.dto';

export class UpdateDia0Dto extends PartialType(CreateDia0Dto) {}
