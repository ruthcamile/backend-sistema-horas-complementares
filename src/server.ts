// src/server.ts
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes'; // <-- IMPORTAÇÃO NOVA
import { certificadoRoutes } from './routes/certificado.routes';

dotenv.config(); 

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Registrando a rota de autenticação (Tudo que for /api/auth vai para aquele arquivo)
app.use('/api/auth', authRoutes); 
app.use('/api/certificados', certificadoRoutes);

app.get('/health', (req, res) => {
  return res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});