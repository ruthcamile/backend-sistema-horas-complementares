"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// ⚠️ ATENÇÃO: Use as chaves { } nas importações, pois suas rotas usam export nomeado!
const auth_routes_1 = require("./routes/auth.routes");
const certificado_routes_1 = require("./routes/certificado.routes");
const validacao_routes_1 = require("./routes/validacao.routes");
const dashboard_routes_1 = require("./routes/dashboard.routes");
const app = (0, express_1.default)();
// Middlewares obrigatórios
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/validacao', validacao_routes_1.validacaoRoutes);
app.use('/api/dashboard', dashboard_routes_1.dashboardRoutes);
// =================================================================
// VÍNCULO DAS ROTAS COM OS PREFIXOS EXIGIDOS PELO FRONTEND
// =================================================================
// 1. Rotas de Autenticação -> ex: /api/auth/login
app.use('/api/auth', auth_routes_1.authRoutes);
// 2. Rotas de Certificados do Aluno -> ex: /api/certificados/meus
app.use('/api/certificados', certificado_routes_1.certificadoRoutes);
// 3. Rotas de Validação (Onde estava dando 404) -> resolve para /api/validacao/validar
app.use('/api/validacao', validacao_routes_1.validacaoRoutes);
// 4. Rotas de Dashboard (Onde estava dando 404) -> resolve para /api/dashboard/coordenador
app.use('/api/dashboard', dashboard_routes_1.dashboardRoutes);
// Rota de teste para checar se o backend está online no Render
app.get('/', (req, res) => {
    res.json({ status: "Backend online e operando com sucesso!" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});
