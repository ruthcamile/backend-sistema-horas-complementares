import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listarFilaValidacao, avaliarCertificado, buscarCertificadosPorMatricula } from '../controllers/ValidacaoController';

const validacaoRoutes = Router();

// Rota para o frontend pegar os dados da fila de validação do coordenador
// URL: GET /api/validacao
validacaoRoutes.get('/validar', authMiddleware, listarFilaValidacao);

// Rota para quando o coordenador clicar no botão de APROVAR ou RECUSAR um certificado
// URL: PATCH /api/validacao/:idValidacao
validacaoRoutes.patch('/validar/:idValidacao', authMiddleware, avaliarCertificado);

// Rota para o coordenador buscar os certificados de um aluno específico pela matrícula
// URL: GET /api/coordenador/aluno/:matricula
validacaoRoutes.get('/aluno/:matricula', authMiddleware, buscarCertificadosPorMatricula);

export { validacaoRoutes };