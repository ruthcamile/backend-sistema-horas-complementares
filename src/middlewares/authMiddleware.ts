import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("Vazamento de segurança crítico: JWT_SECRET não está definida no ambiente.");
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ erro: 'Token não fornecido. Faça login.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    (req as any).user = decoded; 
    next(); 
  } catch (error) {
    res.status(401).json({ erro: 'Token inválido ou expirado.' });
    return;
  }
}