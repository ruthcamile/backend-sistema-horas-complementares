<div align="center">

<img src="https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
<img src="https://img.shields.io/badge/Aiven-FF3621?style=for-the-badge&logo=aiven&logoColor=white" />

# 🎓 SGH — Sistema de Gestão de Horas Complementares

**API REST para controle e validação de horas extracurriculares acadêmicas.**  
Projeto Integrador · 3° Período · Análise e Desenvolvimento de Sistemas

</div>

---

## 📌 Sobre o Projeto

O **SGH (Sistema de Gestão de Horas Complementares)** é uma solução desenvolvida para **digitalizar e automatizar** o processo de envio, análise e validação de certificados extracurriculares em instituições de ensino superior.

Antes do sistema, o controle de horas complementares era feito de forma manual — alunos entregavam documentos físicos, coordenadores analisavam em planilhas e o histórico era difícil de rastrear. O SGH resolve esses problemas com uma plataforma centralizada no formato **PWA (Progressive Web App)**, que funciona como um aplicativo nativo em qualquer dispositivo.

> 💡 **Contexto acadêmico:** Desenvolvido como Projeto Integrador do 3° Período do curso de Análise e Desenvolvimento de Sistemas, simulando um sistema real utilizado por instituições de ensino para gestão de atividades complementares obrigatórias.

---

## 🎯 Objetivos

- Eliminar o controle manual e descentralizado de horas complementares
- Oferecer um fluxo digital de envio, análise e aprovação de certificados
- Garantir rastreabilidade completa do histórico de cada aluno
- Proporcionar dashboards com métricas em tempo real para coordenadores e alunos
- Aplicar boas práticas de desenvolvimento: autenticação JWT, ORM, deploy em nuvem e armazenamento externo de arquivos

---

## ✨ Funcionalidades

### 👩‍🎓 Perfil Aluno
- Cadastro e autenticação segura via e-mail e senha
- Upload de certificados (PDF ou imagem) diretamente pela plataforma
- Acompanhamento em tempo real do status de cada submissão (Pendente, Aprovado, Reprovado)
- Dashboard pessoal com total de certificados enviados, aprovados e carga horária acumulada

### 👨‍💼 Perfil Coordenador
- Painel de validação com fila de certificados pendentes
- Visualização dos documentos armazenados na nuvem
- Aprovação ou rejeição de certificados com registro de observação
- Controle restrito aos alunos vinculados ao seu curso

---

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (PWA)                     │
│          Browser / Mobile / Desktop                 │
└────────────────────┬────────────────────────────────┘
                     │ HTTP (REST)
┌────────────────────▼────────────────────────────────┐
│              API REST — Node.js + Express           │
│                  Hospedagem: Render                 │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │   Rotas     │  │  Middlewares │  │Controllers│  │
│  │  /auth      │  │  JWT Auth    │  │  Aluno    │  │
│  │  /certif.   │  │  RBAC Perfil │  │  Coord.   │  │
│  │  /dashboard │  │  Multer      │  │  Dashboard│  │
│  └─────────────┘  └──────────────┘  └───────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │             Prisma ORM                      │    │
│  └──────────────────┬──────────────────────────┘    │
└─────────────────────┼───────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
┌───────▼────────┐         ┌─────────▼──────────┐
│  MySQL (Aiven) │         │  Supabase Storage  │
│  Banco na      │         │  Arquivos PDF/IMG   │
│  Nuvem         │         │  (S3-Compatible)    │
└────────────────┘         └────────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Runtime | Node.js | Motor do servidor |
| Framework | Express.js | Roteamento e middlewares |
| Linguagem | TypeScript | Tipagem estática e segurança |
| ORM | Prisma | Consultas tipadas e migrations |
| Banco de Dados | MySQL | Persistência relacional dos dados |
| Autenticação | JWT | Sessões seguras e rotas protegidas |
| Upload | Multer | Processamento de arquivos no servidor |
| Storage | Supabase (S3) | Armazenamento de certificados na nuvem |
| Banco na Nuvem | Aiven Cloud | Hospedagem do MySQL em produção |
| Deploy | Render | Hospedagem contínua da API (PaaS) |

---

## 🗂️ Estrutura de Pastas

```
backend-sistema-horas-complementares/
│
├── prisma/
│   └── schema.prisma          # Modelo de dados do banco
│
├── src/
│   ├── controllers/           # Lógica de negócio por recurso
│   │   ├── authController.ts
│   │   ├── certificadoController.ts
│   │   └── dashboardController.ts
│   │
│   ├── middlewares/           # JWT, RBAC, upload
│   │   ├── authMiddleware.ts
│   │   ├── perfilMiddleware.ts
│   │   └── uploadMiddleware.ts
│   │
│   ├── routes/                # Definição das rotas da API
│   │   ├── authRoutes.ts
│   │   ├── certificadoRoutes.ts
│   │   └── dashboardRoutes.ts
│   │
│   ├── services/              # Integrações externas (Storage)
│   └── server.ts              # Ponto de entrada da aplicação
│
├── .env.example               # Modelo de variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 Rotas da API

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/api/auth/register` | Cadastro de novo usuário | ❌ |
| `POST` | `/api/auth/login` | Login e geração do token JWT | ❌ |
| `POST` | `/api/certificados` | Upload e registro de certificado | ✅ Aluno |
| `GET` | `/api/certificados` | Lista certificados (por perfil) | ✅ Ambos |
| `PATCH` | `/api/certificados/:id/validar` | Aprovar ou rejeitar certificado | ✅ Coordenador |
| `GET` | `/api/dashboard` | Métricas de horas e envios | ✅ Ambos |

> 💡 Recomendamos o uso do [Postman](https://www.postman.com/) ou [Thunder Client](https://www.thunderclient.com/) para testar as rotas.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) v18+
- [Git](https://git-scm.com/)
- Banco de dados MySQL local ou acesso ao Aiven

### 1. Clone o repositório
```bash
git clone https://github.com/ruthcamile/backend-sistema-horas-complementares.git
cd backend-sistema-horas-complementares
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Banco de Dados
DATABASE_URL="mysql://usuario:senha@host:porta/nome_do_banco"

# Autenticação
JWT_SECRET="chave_secreta_super_segura"
PORT=3000

# Supabase Storage (S3-Compatible)
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="sua_access_key"
AWS_SECRET_ACCESS_KEY="sua_secret_key"
AWS_S3_ENDPOINT="https://seu-projeto.supabase.co/storage/v1/s3"
AWS_S3_BUCKET="nome-do-bucket"
```

### 4. Execute as migrations do banco
```bash
npx prisma db push
```

### 5. Inicie o servidor

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3000` 🟢

---

## 🗃️ Modelo de Dados

O banco de dados foi modelado a partir de um diagrama ER e implementado com Prisma ORM. As principais entidades são:

```
Usuario ──── Aluno ──────── Certificado ──── Validacao
         └── Coordenador ─── Curso ─────────── Area_Atividade
                          └── Regra
```

- **Usuario** — entidade base com herança para Aluno e Coordenador
- **Certificado** — documento enviado pelo aluno para análise
- **Validacao** — resultado da análise (Pendente / Aprovado / Reprovado)
- **Regra** — limites de horas por área e tipo de atividade por curso

---

## 🌐 Deploy

| Serviço | Plataforma | Descrição |
|---|---|---|
| API REST | [Render](https://render.com) | Deploy automático via GitHub |
| Banco de Dados | [Aiven Cloud](https://aiven.io) | MySQL gerenciado na nuvem |
| Storage de Arquivos | [Supabase](https://supabase.com) | Bucket S3-compatible público |

---

## 👥 Equipe

Projeto desenvolvido por estudantes do **3° Período de Análise e Desenvolvimento de Sistemas** como parte da disciplina de Projeto Integrador.

| Nome | LinkedIn | GitHub |
|---|---|---|
| Ruth Camile | [LinkedIn](#) | [GitHub](https://github.com/ruthcamile) |
| [Integrante 2] | [LinkedIn](#) | [GitHub](#) |
| [Integrante 3] | [LinkedIn](#) | [GitHub](#) |

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com 💙 por estudantes de ADS · Projeto Integrador 3° Período

</div>
