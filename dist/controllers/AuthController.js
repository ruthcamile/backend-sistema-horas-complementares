"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
// src/controllers/AuthController.ts
const express_1 = require("express");
const AuthService_1 = require("../services/AuthService");
const authService = new AuthService_1.AuthService();
class AuthController {
    async cadastrar(req, res) {
        try {
            await authService.cadastrar(req.body);
            return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
        }
        catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const dadosLogin = await authService.login(email, senha);
            return res.status(200).json(dadosLogin);
        }
        catch (error) {
            return res.status(401).json({ erro: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map