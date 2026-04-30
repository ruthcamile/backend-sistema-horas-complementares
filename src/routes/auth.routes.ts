// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();
const authController = new AuthController();

// Repare que não chamamos a função, só passamos a referência dela
authRoutes.post('/cadastro', authController.cadastrar);
authRoutes.post('/login', authController.login);

export { authRoutes };