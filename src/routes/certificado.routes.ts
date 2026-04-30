// src/routes/certificado.routes.ts
import { Router } from 'express';
import { CertificadoController } from '../controllers/CertificadoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../config/multer';

const certificadoRoutes = Router();
const certificadoController = new CertificadoController();

// 1. Rota de Upload (POST)
certificadoRoutes.post(
  '/enviar', 
  authMiddleware, 
  upload.single('arquivo'), 
  certificadoController.enviar
);

// 2. Rota de Listagem do Aluno (GET)
certificadoRoutes.get('/meus', authMiddleware, certificadoController.listarMeus);

// 3. NOVA Rota de Listagem do Coordenador (GET)
// Tem que ficar AQUI, antes do export!
certificadoRoutes.get('/pendentes', authMiddleware, certificadoController.listarPendentes);

// NOVA ROTA: Validação pelo Coordenador (PATCH)
// O :id é um route param dinâmico interceptado pelo Express
certificadoRoutes.patch('/:id/validar', authMiddleware, certificadoController.validar);

// O export PRECISA ser a última linha do arquivo!
export { certificadoRoutes };