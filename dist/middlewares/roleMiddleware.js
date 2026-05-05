"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const express_1 = require("express");
// recebemos um array de perfis permitidos
const checkRole = (rolesPermitidas) => {
    return (req, res, next) => {
        // o authMiddleware injeta os dados do token aqui
        const usuarioLogado = req.user;
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
exports.checkRole = checkRole;
//# sourceMappingURL=roleMiddleware.js.map