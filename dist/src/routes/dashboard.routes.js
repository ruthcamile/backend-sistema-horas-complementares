"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const DashboardController_1 = require("../controllers/DashboardController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes = dashboardRoutes;
// Rota para o Aluno
dashboardRoutes.get('/aluno', authMiddleware_1.authMiddleware, DashboardController_1.getDashboardAluno);
// Rota para o Coordenador
dashboardRoutes.get('/coordenador', authMiddleware_1.authMiddleware, DashboardController_1.getDashboardCoordenador);
