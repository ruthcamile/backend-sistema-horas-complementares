// src/routes/certificado.routes.ts
import { Router } from 'express';
import { CertificadoController } from '../controllers/CertificadoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
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

// Rota de Listagem do Coordenador (GET) - protegidas por autenticação e role
certificadoRoutes.get(
  '/pendentes', 
  authMiddleware, 
  checkRole(['COORDENADOR']), // <--- TRAVA DE ROLE AQUI
  certificadoController.listarPendentes
);

// Rota de Validação pelo Coordenador (PATCH) - protegida por autenticação e role
certificadoRoutes.patch(
  '/:id/validar', 
  authMiddleware, 
  checkRole(['COORDENADOR']), // <--- TRAVA DE ROLE AQUI
  certificadoController.validar
);

export { certificadoRoutes };