import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsuarioService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const usuarioExistente = await this.usuarioService.findByEmailWithPassword(registerDto.email);
    if (usuarioExistente) {
      throw new ConflictException('Este e-mail já está registrado.');
    }

    const novoUsuario = await this.usuarioService.create({
      email: registerDto.email,
      nome: registerDto.nome,
      sobrenome: registerDto.sobrenome,
      senha: registerDto.senha,
      admin: registerDto.admin ?? false,
      ativo: false,
    });

    return novoUsuario;
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.usuarioService.findByEmailWithPassword(loginDto.email);

    if (!usuario || !(await bcrypt.compare(loginDto.senha, usuario.senha))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { email: usuario.email, sub: usuario.id, admin: usuario.admin };

    // Buscar os dados completos do usuário para retornar
    const usuarioCompleto = await this.usuarioService.findOne(usuario.id);

    return {
      access_token: this.jwtService.sign(payload),
      user: usuarioCompleto,
    };
  }
}