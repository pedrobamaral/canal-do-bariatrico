import { ConflictException, Injectable } from '@nestjs/common';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnderecoService {
constructor(private prisma: PrismaService) {}

  async create(data: CreateEnderecoDto) {
    const Endereco = await this.prisma.endereco.findFirst({
            where: { CEP: data.CEP },
        })
        if (Endereco) {
            throw new ConflictException(`Endereco com CEP ${data.CEP} já existe`);
        }

    // Remove 'id' if present, since Prisma will auto-generate it
    const { id, idUsuario, endereco, ...rest } = data;
    const dataToCreate: any = {
      endereço: endereco, // use correct property name with accent
      ...rest,
      CEP: data.CEP,
      complemento: data.complemento,
    };
    if (idUsuario !== undefined) {
      dataToCreate.usuario = { connect: { id: idUsuario } };
    }
    return await this.prisma.endereco.create({ data: dataToCreate });
  }

  async findAll() {
    return this.prisma.endereco.findMany();
  }

  async findOne(id: number) {
    const one = await this.prisma.endereco.findUnique({
      where: {id},
    })
    if (!one) {
      throw new Error(`Endereco com id ${id} nao encontrado`)
    }

    return one
  }

  async findByCEP(CEP: string) {
    const end = await this.prisma.endereco.findFirst({
      where: { CEP },
    })
    if (!end) {
      throw new Error(`Endereco com CEP ${CEP} nao encontrado`)
    }

    return `Endereco: ${end.endereco} ${end.complemento}`
  }

  async update(id: number, data: UpdateEnderecoDto) {
    const one = await this.prisma.endereco.findUnique({
      where: {id},
    })
    if (!one) {
      throw new Error(`Endereco com id ${id} nao encontrado`)
    }

    return this.prisma.endereco.update({where: {id}, data:data})
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({where: {id}})
  }
}
