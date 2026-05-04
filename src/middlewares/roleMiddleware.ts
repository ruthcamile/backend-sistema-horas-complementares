import { Request, Response, NextFunction } from 'express';

// recebemos um array de perfis permitidos
export const checkRole = (rolesPermitidas: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    // o authMiddleware injeta os dados do token aqui
    const usuarioLogado = (req as any).user;

    // se a regra (role) do usuário logado não estiver na lista de permitidas, bloqueia
    if (!rolesPermitidas.includes(usuarioLogado.role)) {
      return res.status(403).json({ 
        erro: 'Acesso negado: Seu perfil não tem permissão para realizar esta ação.' 
      });
    }

    // se tiver o perfil permitido, segue para o próximo middleware ou rota
    next();
  };
};