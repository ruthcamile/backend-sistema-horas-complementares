"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validacaoRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const ValidacaoController_1 = require("../controllers/ValidacaoController");
const validacaoRoutes = (0, express_1.Router)();
exports.validacaoRoutes = validacaoRoutes;
// Rota para o frontend pegar os dados da fila de validação do coordenador
// URL: GET /api/validacao
validacaoRoutes.get('/validar', authMiddleware_1.authMiddleware, ValidacaoController_1.listarFilaValidacao);
// Rota para quando o coordenador clicar no botão de APROVAR ou RECUSAR um certificado
// URL: PATCH /api/validacao/:idValidacao
validacaoRoutes.patch('/validar/:idValidacao', authMiddleware_1.authMiddleware, ValidacaoController_1.avaliarCertificado);
// Rota para o coordenador buscar os certificados de um aluno específico pela matrícula
// URL: GET /api/coordenador/aluno/:matricula
validacaoRoutes.get('/aluno/:matricula', authMiddleware_1.authMiddleware, ValidacaoController_1.buscarCertificadosPorMatricula);
