import { PartialType } from '@nestjs/mapped-types';
import { createProdutoDto } from './createprodutodto.dto';

export class UpdateProdutoDto extends PartialType(createProdutoDto) {}