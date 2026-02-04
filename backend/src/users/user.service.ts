import {Injectable, NotFoundException, ConflictException, InternalServerErrorException,} from '@nestjs/common'; 
import { PrismaService } from '../database/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
// Avoid importing Prisma generated runtime/types here to keep build independent of generated client.
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
  const emailEmUso = await this.prisma.usuario.findUnique({
    where: { email: createUsuarioDto.email },
  });

  if (emailEmUso) {
    throw new ConflictException('Este endereço de e-mail já está em uso.');
  }

  try {
    const novoUsuario = await this.prisma.usuario.create({
      data: {
        email: createUsuarioDto.email,
        nome: createUsuarioDto.nome,
        senha: await bcrypt.hash(createUsuarioDto.senha, 10),
        admin: createUsuarioDto.admin ?? false,
        ativo: createUsuarioDto.ativo ?? false,

        telefone: createUsuarioDto.telefone,
        // Cast to any to avoid build-time mismatch with generated Prisma enum types
        sexo: createUsuarioDto.sexo as any,
        peso: createUsuarioDto.peso,
        altura: createUsuarioDto.altura,
        nascimento: createUsuarioDto.nascimento,
        massa_magra: createUsuarioDto.massa_magra,
        meta: createUsuarioDto.meta,
      },
    });

    const { senha, ...result } = novoUsuario;
    return result;
  } catch (error) {
    throw new InternalServerErrorException('Não foi possível criar o usuário.');
  }
}

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        dataCriacao: true,
      },
    });
  }

  async findOne(id: string | number) {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        foto: true,
        sexo: true,
        peso: true,
        altura: true,
        nascimento: true,
        massa_magra: true,
        meta: true,
        admin: true,
        ativo: true,
        dataCriacao: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID #${id} não encontrado.`);
    }

    console.log('=== FINDONE - Usuário retornado ===');
    console.log('usuario:', usuario);
    console.log('usuario.telefone:', usuario.telefone);

    return usuario;
  }

  async findByEmailWithPassword(email: string): Promise<any | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async update(id: number | string, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id); 

    if (updateUsuarioDto.senha && typeof updateUsuarioDto.senha === 'string') {
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    try {
      // Mapeia os campos do DTO para os campos do Prisma
      const dataToUpdate: any = {};
      
      if (updateUsuarioDto.nome !== undefined) dataToUpdate.nome = updateUsuarioDto.nome;
      if (updateUsuarioDto.email !== undefined) dataToUpdate.email = updateUsuarioDto.email;
      if (updateUsuarioDto.senha !== undefined) dataToUpdate.senha = updateUsuarioDto.senha;
      if (updateUsuarioDto.telefone !== undefined) dataToUpdate.telefone = updateUsuarioDto.telefone;
      if (updateUsuarioDto.foto !== undefined) dataToUpdate.foto = updateUsuarioDto.foto;
      if (updateUsuarioDto.sexo !== undefined) dataToUpdate.sexo = updateUsuarioDto.sexo;
      if (updateUsuarioDto.peso !== undefined) dataToUpdate.peso = updateUsuarioDto.peso;
      if (updateUsuarioDto.altura !== undefined) dataToUpdate.altura = updateUsuarioDto.altura;
      if (updateUsuarioDto.nascimento !== undefined) {
        // Converte para Date se for string
        dataToUpdate.nascimento = typeof updateUsuarioDto.nascimento === 'string' 
          ? new Date(updateUsuarioDto.nascimento) 
          : updateUsuarioDto.nascimento;
      }
      if (updateUsuarioDto.massa_magra !== undefined) dataToUpdate.massa_magra = updateUsuarioDto.massa_magra;
      if (updateUsuarioDto.meta !== undefined) dataToUpdate.meta = updateUsuarioDto.meta;
      if (updateUsuarioDto.admin !== undefined) dataToUpdate.admin = updateUsuarioDto.admin;
      if (updateUsuarioDto.ativo !== undefined) dataToUpdate.ativo = updateUsuarioDto.ativo;

      console.log('=== UPDATE USER - dataToUpdate ===');
      console.log(JSON.stringify(dataToUpdate, null, 2));

      const usuarioAtualizado = await this.prisma.usuario.update({
        where: { id: typeof id === 'string' ? parseInt(id, 10) : id },
        data: dataToUpdate,
        select: {
          id: true,
          nome: true,
          email: true,
          telefone: true,
          foto: true,
          sexo: true,
          peso: true,
          altura: true,
          nascimento: true,
          massa_magra: true,
          meta: true,
          admin: true,
          ativo: true,
          dataCriacao: true,
        },
      });

      return usuarioAtualizado; 
    } catch (error) {
      console.error('=== UPDATE USER ERROR ===');
      console.error(error);
      throw new InternalServerErrorException('Não foi possível atualizar o usuário.');
    }
  }

  async remove(id: number | string) {
    await this.findOne(id); 
    return this.prisma.usuario.delete({
      where: { id: typeof id === 'string' ? parseInt(id, 10) : id },
    });
  }

  /**
   * Calcula estatísticas de adesão do usuário comparando DiaCiclo (planejado) com Daily (realizado).
   * Retorna porcentagens para dieta, hidratação (água) e medicação.
   */
  async getAdherenceStats(userId: number | string) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    // Busca todos os DiaCiclos do usuário que têm um Daily associado
    const diaCiclos = await this.prisma.diaCiclo.findMany({
      where: { idUsuario: id },
      include: {
        daily: true,
      },
    });

    // Inicializa contadores
    let dietaTotal = 0;
    let dietaCumprida = 0;
    let aguaTotal = 0;
    let aguaCumprida = 0;
    let medicacaoTotal = 0;
    let medicacaoCumprida = 0;

    for (const dc of diaCiclos) {
      // Dieta: se tem_dieta está marcado no DiaCiclo, conta como esperado
      if (dc.tem_dieta) {
        dietaTotal++;
        // Se o Daily existe e dieta_check é true, conta como cumprido
        if (dc.daily?.dieta_check === true) {
          dietaCumprida++;
        }
      }

      // Água/Hidratação: se tem_agua está marcado no DiaCiclo
      if (dc.tem_agua) {
        aguaTotal++;
        if (dc.daily?.agua_check === true) {
          aguaCumprida++;
        }
      }

      // Medicação: considera med_prescrita e/ou mounjaro
      if (dc.tem_med_prescrita || dc.tem_mounjaro) {
        medicacaoTotal++;
        // Verifica se cumpriu pelo menos uma das medicações esperadas
        const cumprouMed = (dc.tem_med_prescrita && dc.daily?.med_prescrita_check === true) ||
                          (dc.tem_mounjaro && dc.daily?.mounjaro_check === true);
        if (cumprouMed) {
          medicacaoCumprida++;
        }
      }
    }

    // Calcula porcentagens (evita divisão por zero)
    const dietaPct = dietaTotal > 0 ? Math.round((dietaCumprida / dietaTotal) * 100) : null;
    const aguaPct = aguaTotal > 0 ? Math.round((aguaCumprida / aguaTotal) * 100) : null;
    const medicacaoPct = medicacaoTotal > 0 ? Math.round((medicacaoCumprida / medicacaoTotal) * 100) : null;

    // Determina cor do status baseado na porcentagem
    const getStatusColor = (pct: number | null): string => {
      if (pct === null) return 'gray'; // sem dados
      if (pct >= 80) return 'green';
      if (pct >= 50) return 'yellow';
      return 'red';
    };

    return {
      dieta: {
        total: dietaTotal,
        cumprida: dietaCumprida,
        porcentagem: dietaPct,
        status: getStatusColor(dietaPct),
      },
      hidratacao: {
        total: aguaTotal,
        cumprida: aguaCumprida,
        porcentagem: aguaPct,
        status: getStatusColor(aguaPct),
      },
      medicacao: {
        total: medicacaoTotal,
        cumprida: medicacaoCumprida,
        porcentagem: medicacaoPct,
        status: getStatusColor(medicacaoPct),
      },
      // Dados agregados do ciclo atual (se houver)
      totalDiaCiclos: diaCiclos.length,
      diasComDaily: diaCiclos.filter(dc => dc.daily !== null).length,
    };
  }
}