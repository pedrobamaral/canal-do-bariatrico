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
          sobrenome: createUsuarioDto.sobrenome,
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
        } as any,
    });

    const { senha, ...result } = novoUsuario;
    return result;
  } catch (error) {
    console.error('=== CREATE USER ERROR ===');
    console.error(error);
    throw new InternalServerErrorException('Não foi possível criar o usuário.');
  }
}

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        telefone: true,
        foto: true,
        peso: true,
        altura: true,
        meta: true,
        admin: true,
        ativo: true,
        dataCriacao: true,
      } as any,
    });
  }

  async findOne(id: string | number) {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
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
      } as any,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID #${id} não encontrado.`);
    }

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
      if (updateUsuarioDto.sobrenome !== undefined) dataToUpdate.sobrenome = updateUsuarioDto.sobrenome;
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

      const usuarioAtualizado = await this.prisma.usuario.update({
        where: { id: typeof id === 'string' ? parseInt(id, 10) : id },
        data: dataToUpdate,
        select: {
          id: true,
          nome: true,
          sobrenome: true,
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
        } as any,
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
   * Considera APENAS os dias que já passaram (data_dia <= hoje), não o ciclo inteiro.
   * Retorna porcentagens para água, dieta, treino e mounjaro.
   */
  async getAdherenceStats(userId: number | string) {
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    // Data de hoje (fim do dia para comparação justa)
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    // Verifica se o usuário tem mounjaro ativo em algum ciclo
    const cicloAtivo = await this.prisma.ciclo.findFirst({
      where: { idUsuario: id, ativoCiclo: true },
      select: { mounjaro: true },
    });
    const temMounjaro = cicloAtivo?.mounjaro === true;

    // Busca todos os DiaCiclos do usuário com Daily associado
    const diaCiclos = await this.prisma.diaCiclo.findMany({
      where: { idUsuario: id },
      include: {
        daily: true,
      },
      orderBy: { dia_ciclo: 'asc' },
    });

    // Filtra apenas os dias que já passaram (data_dia <= hoje)
    const diasPassados = diaCiclos.filter(dc => {
      if (!dc.data_dia) return false;
      return new Date(dc.data_dia) <= hoje;
    });

    // Inicializa contadores
    let dietaTotal = 0;
    let dietaCumprida = 0;
    let aguaTotal = 0;
    let aguaCumprida = 0;
    let treinoTotal = 0;
    let treinoCumprido = 0;
    let mounjaroTotal = 0;
    let mounjaroCumprido = 0;

    for (const dc of diasPassados) {
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

      // Treino: se tem_treino está marcado no DiaCiclo
      if (dc.tem_treino) {
        treinoTotal++;
        if (dc.daily?.treino_check === true) {
          treinoCumprido++;
        }
      }

      // Mounjaro: se tem_mounjaro está marcado no DiaCiclo
      if (dc.tem_mounjaro) {
        mounjaroTotal++;
        if (dc.daily?.mounjaro_check === true) {
          mounjaroCumprido++;
        }
      }
    }

    // Calcula porcentagens (evita divisão por zero)
    const dietaPct = dietaTotal > 0 ? Math.round((dietaCumprida / dietaTotal) * 100) : null;
    const aguaPct = aguaTotal > 0 ? Math.round((aguaCumprida / aguaTotal) * 100) : null;
    const treinoPct = treinoTotal > 0 ? Math.round((treinoCumprido / treinoTotal) * 100) : null;
    const mounjaroPct = mounjaroTotal > 0 ? Math.round((mounjaroCumprido / mounjaroTotal) * 100) : null;

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
      treino: {
        total: treinoTotal,
        cumprida: treinoCumprido,
        porcentagem: treinoPct,
        status: getStatusColor(treinoPct),
      },
      mounjaro: {
        total: mounjaroTotal,
        cumprida: mounjaroCumprido,
        porcentagem: mounjaroPct,
        status: getStatusColor(mounjaroPct),
      },
      // Flag indicando se o usuário usa mounjaro
      temMounjaro,
      // Dados agregados: dias que já passaram vs dias com resposta
      totalDiaCiclos: diasPassados.length,
      diasComDaily: diasPassados.filter(dc => dc.daily !== null).length,
    };
  }
}