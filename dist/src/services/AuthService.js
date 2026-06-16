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
const SECRET = process.env.JWT_SECRET;
class AuthService {
    async cadastrar(dados) {
        // 1. Agora extraímos também o 'cursoId' enviado pelo frontend
        const { nome, email, senha, role, matricula, departamento, cursoId } = dados;
        // Verifica se o e-mail já existe
        const usuarioExiste = await userRepository.findByEmail(email);
        if (usuarioExiste) {
            throw new Error('Este e-mail já está em uso.');
        }
        // Criptografa a senha
        const senhaHash = await bcrypt_1.default.hash(senha, 10);
        // 2. Montamos os dados base comuns a qualquer usuário
        const dadosCriacao = {
            nome,
            email,
            senha: senhaHash,
            role: role || client_1.Role.ALUNO, // Define ALUNO como padrão caso não venha no payload
        };
        // 3. Separamos a regra de negócio por perfil antes de mandar para o Repository
        if (dadosCriacao.role === client_1.Role.COORDENADOR) {
            dadosCriacao.departamento = departamento;
        }
        else {
            // Se for ALUNO, criamos o registro aninhado na tabela intermediária UsuariosCursos
            if (!cursoId) {
                throw new Error('É necessário informar um curso para cadastrar um aluno.');
            }
            dadosCriacao.departamento = null;
            dadosCriacao.cursos = {
                create: {
                    cursoId: Number(cursoId),
                    matricula: matricula, // Salvando a matrícula obrigatória aqui!
                },
            };
        }
        // 4. Salva no banco passando o objeto estruturado
        const novoUsuario = await userRepository.create(dadosCriacao);
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
