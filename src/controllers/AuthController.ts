// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async cadastrar(req: Request, res: Response) {
    try {
      await authService.cadastrar(req.body);
      return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;
      const dadosLogin = await authService.login(email, senha);
      
      return res.status(200).json(dadosLogin);
    } catch (error: any) {
      return res.status(401).json({ erro: error.message });
    }
  }
}