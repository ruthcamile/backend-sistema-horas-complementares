// src/services/AuthService.ts
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const userRepository = new UserRepository();
// Em produção, isso ficaria no seu .env
const SECRET = process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2024';

export class AuthService {
  async cadastrar(dados: any) {
    const { nome, email, senha, role, matricula, departamento } = dados;

    // 1. Verifica se o e-mail já existe
    const usuarioExiste = await userRepository.findByEmail(email);
    if (usuarioExiste) {
      throw new Error('Este e-mail já está em uso.');
    }

    // 2. Criptografa a senha (10 rounds de salt)
    const senhaHash = await bcrypt.hash(senha, 10);

    // 3. Salva no banco
    const novoUsuario = await userRepository.create({
      nome,
      email,
      senha: senhaHash,
      role: role as Role,
      matricula: role === 'ALUNO' ? matricula : null,
      departamento: role === 'COORDENADOR' ? departamento : null,
    });

    return novoUsuario;
  }

  async login(email: string, senha: string) {
    // 1. Busca o usuário
    const usuario = await userRepository.findByEmail(email);
    if (!usuario) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // 2. Compara as senhas
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('E-mail ou senha inválidos.');
    }

    // 3. Gera o Token JWT
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role }, 
      SECRET, 
      { expiresIn: '8h' } // Token expira em 8 horas
    );

    return {
      token,
      perfil: usuario.role,
      nome: usuario.nome,
    };
  }
}