import { Router } from 'express';
import { getDashboardAluno } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const dashboardRoutes = Router();

// A rota fica protegida: só quem tem token entra
dashboardRoutes.get('/', authMiddleware, getDashboardAluno);

export { dashboardRoutes };