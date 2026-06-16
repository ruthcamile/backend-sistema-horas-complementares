// src/server.ts
import express from 'express';
import cors from 'cors';

// ⚠️ ATENÇÃO: Use as chaves { } nas importações, pois suas rotas usam export nomeado!
import { authRoutes } from './routes/auth.routes';
import { certificadoRoutes } from './routes/certificado.routes';
import { validacaoRoutes } from './routes/validacao.routes';
import { dashboardRoutes } from './routes/dashboard.routes';

const app = express();

// Middlewares obrigatórios
app.use(cors());
app.use(express.json());
app.use('/api/validacao', validacaoRoutes);
app.use('/api/dashboard', dashboardRoutes);
// =================================================================
// VÍNCULO DAS ROTAS COM OS PREFIXOS EXIGIDOS PELO FRONTEND
// =================================================================

// 1. Rotas de Autenticação -> ex: /api/auth/login
app.use('/api/auth', authRoutes);

// 2. Rotas de Certificados do Aluno -> ex: /api/certificados/meus
app.use('/api/certificados', certificadoRoutes);

// 3. Rotas de Validação (Onde estava dando 404) -> resolve para /api/validacao/validar
app.use('/api/validacao', validacaoRoutes);

// 4. Rotas de Dashboard (Onde estava dando 404) -> resolve para /api/dashboard/coordenador
app.use('/api/dashboard', dashboardRoutes);

// Rota de teste para checar se o backend está online no Render
app.get('/', (req, res) => {
  res.json({ status: "Backend online e operando com sucesso!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});

