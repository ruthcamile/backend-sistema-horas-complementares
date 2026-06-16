"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
// src/routes/auth.routes.ts
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
const authController = new AuthController_1.AuthController();
// Repare que não chamamos a função, só passamos a referência dela
authRoutes.post('/cadastro', authController.cadastrar);
authRoutes.post('/login', authController.login);
