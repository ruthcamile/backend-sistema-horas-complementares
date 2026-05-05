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
// 1. Rota de Upload (POST)
certificadoRoutes.post('/enviar', authMiddleware_1.authMiddleware, multer_1.upload.single('arquivo'), certificadoController.enviar);
// 2. Rota de Listagem do Aluno (GET)
certificadoRoutes.get('/meus', authMiddleware_1.authMiddleware, certificadoController.listarMeus);
// Rota de Listagem do Coordenador (GET) - protegidas por autenticação e role
certificadoRoutes.get('/pendentes', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.checkRole)(['COORDENADOR']), // <--- TRAVA DE ROLE AQUI
certificadoController.listarPendentes);
// Rota de Validação pelo Coordenador (PATCH) - protegida por autenticação e role
certificadoRoutes.patch('/:id/validar', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.checkRole)(['COORDENADOR']), // <--- TRAVA DE ROLE AQUI
certificadoController.validar);
// 3. Rota de Validação do Coordenador (PATCH)
certificadoRoutes.patch('/:id/validar', authMiddleware_1.authMiddleware, (0, roleMiddleware_1.checkRole)(['COORDENADOR']), certificadoController.validar);
//# sourceMappingURL=certificado.routes.js.map