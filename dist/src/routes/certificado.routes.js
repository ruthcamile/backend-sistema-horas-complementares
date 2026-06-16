"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificadoRoutes = void 0;
// src/routes/certificado.routes.ts
const express_1 = require("express");
const CertificadoController_1 = require("../controllers/CertificadoController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const multer_1 = require("../config/multer");
const certificadoRoutes = (0, express_1.Router)();
exports.certificadoRoutes = certificadoRoutes;
const certificadoController = new CertificadoController_1.CertificadoController();
// ==========================================
// ROTAS DE ÁREAS E CURSOS
// ==========================================
// 1. Lista as áreas com suas subcategorias (Hierárquico)
certificadoRoutes.get('/areas', authMiddleware_1.authMiddleware, CertificadoController_1.listarAreas);
// 2. Lista os cursos do aluno logado
certificadoRoutes.get('/cursos-do-aluno', authMiddleware_1.authMiddleware, certificadoController.listarMeusCursos);
// ==========================================
// ROTAS DE CERTIFICADOS (ALUNO)
// ==========================================
// 3. Lista os certificados do aluno logado
certificadoRoutes.get('/meus', authMiddleware_1.authMiddleware, certificadoController.listarMeus);
// 4. Envio de certificado (Com o multer para upload do arquivo)
certificadoRoutes.post('/enviar', authMiddleware_1.authMiddleware, multer_1.upload.single('arquivo'), certificadoController.enviar);
// ==========================================
// ROTAS DE VALIDAÇÃO (COORDENADOR)
// ==========================================
// 5. Listar certificados pendentes na fila
certificadoRoutes.get('/pendentes', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.checkRole)(['COORDENADOR']), certificadoController.listarPendentes);
// 6. Aprovar/Recusar certificado
certificadoRoutes.patch('/:id/validar', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.checkRole)(['COORDENADOR']), certificadoController.validar);
// ==========================================
// ROTAS DINÂMICAS
// ==========================================
// 7. Traz os detalhes de um certificado específico
// IMPORTANTE: Rotas com ":id" precisam ficar no final para o Express não confundir a palavra "meus" ou "pendentes" com um ID.
certificadoRoutes.get('/:id', authMiddleware_1.authMiddleware, certificadoController.detalhar);
