import { Router } from 'express';
import { getDashboardAluno, getDashboardCoordenador } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';


const dashboardRoutes = Router();

// Rota para o Aluno
dashboardRoutes.get('/aluno', authMiddleware, getDashboardAluno);

// Rota para o Coordenador
dashboardRoutes.get('/coordenador', authMiddleware, getDashboardCoordenador);

export { dashboardRoutes };