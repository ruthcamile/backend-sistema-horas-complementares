import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listarFilaValidacao, avaliarCertificado } from '../controllers/ValidacaoController';

const validacaoRoutes = Router();

// Rota para o frontend pegar os dados da fila de validação do coordenador
// URL: GET /api/validacao
validacaoRoutes.get('/validar', authMiddleware, listarFilaValidacao);

// Rota para quando o coordenador clicar no botão de APROVAR ou RECUSAR um certificado
// URL: PATCH /api/validacao/:idValidacao
validacaoRoutes.patch('/validar/:idValidacao', authMiddleware, avaliarCertificado);

export { validacaoRoutes };