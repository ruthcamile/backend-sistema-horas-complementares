"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// src/services/AuthService.ts
const UserRepository_1 = require("../repositories/UserRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const userRepository = new UserRepository_1.UserRepository();
// Em produção, isso ficaria no seu .env
const SECRET = process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2024';
class AuthService {
    async cadastrar(dados) {
        const { nome, email, senha, role, matricula, departamento } = dados;
        // 1. Verifica se o e-mail já existe
        const usuarioExiste = await userRepository.findByEmail(email);
        if (usuarioExiste) {
            throw new Error('Este e-mail já está em uso.');
        }
        // 2. Criptografa a senha (10 rounds de salt)
        const senhaHash = await bcrypt_1.default.hash(senha, 10);
        // 3. Salva no banco
        const novoUsuario = await userRepository.create({
            nome,
            email,
            senha: senhaHash,
            role: role,
            matricula: role === 'ALUNO' ? matricula : null,
            departamento: role === 'COORDENADOR' ? departamento : null,
        });
        return novoUsuario;
    }
    async login(email, senha) {
        // 1. Busca o usuário
        const usuario = await userRepository.findByEmail(email);
        if (!usuario) {
            throw new Error('E-mail ou senha inválidos.');
        }
        // 2. Compara as senhas
        const senhaValida = await bcrypt_1.default.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new Error('E-mail ou senha inválidos.');
        }
        // 3. Gera o Token JWT
        const token = jsonwebtoken_1.default.sign({ id: usuario.id, role: usuario.role }, SECRET, { expiresIn: '8h' } // Token expira em 8 horas
        );
        return {
            token,
            perfil: usuario.role,
            nome: usuario.nome,
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map