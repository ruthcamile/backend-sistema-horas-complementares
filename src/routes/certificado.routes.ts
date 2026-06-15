// src/routes/certificado.routes.ts
import { Router } from 'express';
import { CertificadoController, listarAreas } from '../controllers/CertificadoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { checkRole } from '../middlewares/roleMiddleware';
import { upload } from '../config/multer';

const certificadoRoutes = Router();
const certificadoController = new CertificadoController();


// ==========================================
// ROTAS DE ÁREAS E CURSOS
// ==========================================

// 1. Lista as áreas com suas subcategorias (Hierárquico)
certificadoRoutes.get('/areas', authMiddleware, listarAreas);

// 2. Lista os cursos do aluno logado
certificadoRoutes.get('/cursos-do-aluno', authMiddleware, certificadoController.listarMeusCursos);


// ==========================================
// ROTAS DE CERTIFICADOS (ALUNO)
// ==========================================

// 3. Lista os certificados do aluno logado
certificadoRoutes.get('/meus', authMiddleware, certificadoController.listarMeus);

// 4. Envio de certificado (Com o multer para upload do arquivo)
certificadoRoutes.post(
  '/enviar', 
  authMiddleware, 
  upload.single('arquivo'), 
  certificadoController.enviar
);


// ==========================================
// ROTAS DE VALIDAÇÃO (COORDENADOR)
// ==========================================

// 5. Listar certificados pendentes na fila
certificadoRoutes.get(
  '/pendentes', 
  authMiddleware, 
  checkRole(['COORDENADOR']),
  certificadoController.listarPendentes
);

// 6. Aprovar/Recusar certificado
certificadoRoutes.patch(
  '/:id/validar', 
  authMiddleware, 
  checkRole(['COORDENADOR']),
  certificadoController.validar
);


// ==========================================
// ROTAS DINÂMICAS
// ==========================================

// 7. Traz os detalhes de um certificado específico
// IMPORTANTE: Rotas com ":id" precisam ficar no final para o Express não confundir a palavra "meus" ou "pendentes" com um ID.
certificadoRoutes.get('/:id', authMiddleware, certificadoController.detalhar);

export { certificadoRoutes };