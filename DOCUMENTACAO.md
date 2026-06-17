# 📖 Documentação da API — SGH

<div align="center">

**Sistema de Gestão de Horas Complementares**

<img src="https://img.shields.io/badge/REST-API-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/JSON-Responses-yellow?style=for-the-badge&logo=json&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-Auth-orange?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />

</div>

---

## 📋 Visão Geral

Esta documentação descreve todos os contratos de integração (**Endpoints**) da API do **SGH — Sistema de Gestão de Horas Complementares**.

A API foi construída de forma agnóstica, retornando respostas padronizadas em **JSON**, pronta para consumo por aplicações **PWA, Mobile e Web**.

### Base URL
```
https://seu-projeto.onrender.com
```

### Formato padrão de resposta
```json
{
  "sucesso": true,
  "dados": {},
  "mensagem": "Operação realizada com sucesso"
}
```

---

## 🔐 Autenticação

A maioria das rotas requer autenticação via **JWT Token**.

Envie o token no header de todas as requisições autenticadas:

```http
Authorization: Bearer <seu_token_aqui>
```

> ⚠️ O token é gerado no endpoint de **Login** e tem validade limitada. Guarde-o com segurança.

---

## 📁 Sumário de Rotas

| Método | Rota | Descrição | Auth | Perfil |
|---|---|---|---|---|
| `POST` | `/api/auth/cadastro` | Cadastro de usuário | ❌ | — |
| `POST` | `/api/auth/login` | Login e geração de token | ❌ | — |
| `GET` | `/api/certificados/cursos-do-aluno` | Cursos do aluno logado | ✅ | Aluno |
| `GET` | `/api/certificados/areas` | Lista áreas e subcategorias | ✅ | Aluno |
| `POST` | `/api/certificados/enviar` | Upload de certificado | ✅ | Aluno |
| `GET` | `/api/certificados/meus` | Lista certificados do aluno | ✅ | Aluno |
| `GET` | `/api/certificados/:id` | Detalhes de um certificado | ✅ | Aluno |
| `GET` | `/api/dashboard/aluno` | Dashboard do aluno | ✅ | Aluno |
| `GET` | `/api/validacao/validar` | Fila de validação | ✅ | Coordenador |
| `PATCH` | `/api/validacao/validar/:id` | Aprovar ou recusar certificado | ✅ | Coordenador |
| `GET` | `/api/validacao/aluno/:matricula` | Certificados por matrícula | ✅ | Coordenador |
| `GET` | `/api/dashboard/coordenador` | Dashboard do coordenador | ✅ | Coordenador |

---

## 🛡️ 1. Autenticação

### 1.1 Cadastro de Usuário

Cria um novo usuário (**Aluno** ou **Coordenador**) no sistema.

```http
POST /api/auth/cadastro
```

**Autenticação:** ❌ Não necessária

**Body:**
```json
{
  "nome": "Nome do Aluno",
  "email": "aluno@faculdade.com.br",
  "senha": "senha_segura",
  "role": "ALUNO"
}
```

> O campo `role` aceita: `"ALUNO"` ou `"COORDENADOR"`

**Respostas:**

✅ `201 Created`
```json
{
  "mensagem": "Usuário cadastrado com sucesso!"
}
```

❌ `400 Bad Request`
```json
{
  "erro": "Mensagem de erro específica"
}
```

---

### 1.2 Login

Autentica o usuário e retorna o **JWT Token** para uso nas demais rotas.

```http
POST /api/auth/login
```

**Autenticação:** ❌ Não necessária

**Body:**
```json
{
  "email": "aluno@faculdade.com.br",
  "senha": "senha_segura"
}
```

**Respostas:**

✅ `200 OK` — Retorna dados do usuário e token JWT

❌ `401 Unauthorized`
```json
{
  "erro": "Credenciais inválidas"
}
```

---

## 🎓 2. Área do Aluno

### 2.1 Buscar Cursos do Aluno

Lista os cursos nos quais o aluno logado está matriculado.

```http
GET /api/certificados/cursos-do-aluno
```

**Autenticação:** ✅ Bearer Token

**Respostas:**

✅ `200 OK` — Retorna lista de cursos do aluno

❌ `500 Internal Server Error`
```json
{
  "erro": "Erro ao buscar cursos."
}
```

---

### 2.2 Listar Áreas e Subcategorias

Retorna as áreas de atividade e suas subcategorias para preenchimento do formulário de envio de certificado.

```http
GET /api/certificados/areas
```

**Autenticação:** ✅ Bearer Token

**Resposta:**

✅ `200 OK`
```json
[
  {
    "id": 1,
    "nome": "Ensino",
    "subcategorias": [
      {
        "id": 1,
        "nome": "Monitoria"
      }
    ]
  }
]
```

---

### 2.3 Enviar Certificado (Upload)

Realiza o upload do arquivo e registra a submissão para análise do coordenador.

```http
POST /api/certificados/enviar
```

**Autenticação:** ✅ Bearer Token

**Formato:** `multipart/form-data`

**Campos do formulário:**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `arquivo` | File | ✅ | PDF ou imagem do certificado |
| `cursoId` | Number | ✅ | ID do curso relacionado |
| `areaId` | Number | ✅ | ID da área de atividade |
| `subcategoriaId` | Number | ✅ | ID da subcategoria |
| `tituloAtividade` | String | ✅ | Nome da atividade realizada |
| `cargaHorariaInformada` | Number | ✅ | Horas informadas pelo aluno |
| `dataAtividade` | Date | ✅ | Data de realização da atividade |

**Respostas:**

✅ `201 Created` — Retorna o objeto do certificado criado

❌ `400 Bad Request`
```json
{
  "erro": "O arquivo do comprovante é obrigatório para o envio do certificado."
}
```

---

### 2.4 Listar Meus Certificados

Lista todos os certificados enviados pelo aluno autenticado.

```http
GET /api/certificados/meus
```

**Autenticação:** ✅ Bearer Token

**Respostas:**

✅ `200 OK` — Retorna lista de certificados do aluno com seus respectivos status

---

### 2.5 Detalhes do Certificado

Retorna os detalhes completos de um certificado específico.

```http
GET /api/certificados/:id
```

**Autenticação:** ✅ Bearer Token

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | Number | ID do certificado |

**Respostas:**

✅ `200 OK` — Retorna o certificado com área, subcategoria, curso e histórico de validação

❌ `404 Not Found`
```json
{
  "erro": "Certificado não encontrado."
}
```

---

### 2.6 Dashboard do Aluno

Retorna métricas gerais do aluno: progresso de horas e distribuição por área de atividade.

```http
GET /api/dashboard/aluno
```

**Autenticação:** ✅ Bearer Token

**Query Params (opcional):**

```http
GET /api/dashboard/aluno?cursoId=1
```

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `cursoId` | Number | ❌ | Filtra o dashboard por curso |

**Resposta:**

✅ `200 OK`
```json
{
  "totalExigido": 100,
  "horasConcluidas": 40,
  "distribuicaoPorAtividade": [
    {
      "area": "Ensino",
      "horas": 40
    }
  ]
}
```

---

## 🏢 3. Área do Coordenador

> ⚠️ Todas as rotas desta seção exigem perfil **COORDENADOR**.

### 3.1 Fila de Validação

Retorna os contadores do painel e a lista de certificados **pendentes** de análise, ordenados pela data de envio mais antiga.

```http
GET /api/validacao/validar
```

**Autenticação:** ✅ Bearer Token — `COORDENADOR`

**Resposta:**

✅ `200 OK`
```json
{
  "cards": {
    "pendentes": 5,
    "aprovados": 10,
    "recusados": 2
  },
  "lista": []
}
```

---

### 3.2 Avaliar Certificado

Aprova ou recusa um certificado pendente, registrando as horas validadas e uma observação opcional.

```http
PATCH /api/validacao/validar/:idValidacao
```

**Autenticação:** ✅ Bearer Token — `COORDENADOR`

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `idValidacao` | Number | ID da validação a ser avaliada |

**Body:**
```json
{
  "status": "APROVADO",
  "horasValidadas": 20,
  "observacao": "Certificado excelente."
}
```

**Valores aceitos para `status`:**

| Valor | Descrição |
|---|---|
| `APROVADO` | Horas computadas no histórico do aluno |
| `RECUSADO` | Certificado rejeitado com observação |

**Respostas:**

✅ `200 OK`
```json
{
  "mensagem": "Certificado aprovado com sucesso!",
  "validacao": {}
}
```

❌ `400 Bad Request`
```json
{
  "erro": "Status inválido. Use APROVADO ou RECUSADO."
}
```

---

### 3.3 Buscar Certificados por Matrícula

Permite ao coordenador consultar todos os certificados de um aluno específico pelo número de matrícula.

```http
GET /api/validacao/aluno/:matricula
```

**Autenticação:** ✅ Bearer Token — `COORDENADOR`

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `matricula` | String | Matrícula do aluno |

**Respostas:**

✅ `200 OK` — Retorna dados do aluno, cursos, certificados e histórico de validação

❌ `404 Not Found`
```json
{
  "erro": "Aluno não encontrado com esta matrícula."
}
```

---

### 3.4 Dashboard do Coordenador

Retorna métricas gerais da gestão de certificados do coordenador logado.

```http
GET /api/dashboard/coordenador
```

**Autenticação:** ✅ Bearer Token — `COORDENADOR`

**Resposta:**

✅ `200 OK`
```json
{
  "cards": {
    "totalAlunos": 50,
    "pendentes": 5,
    "aprovados": 120,
    "recusados": 10,
    "horasTotaisValidadas": 850
  },
  "grafico": [
    {
      "nome": "Extensão",
      "horas": 300
    }
  ],
  "metricas": {
    "taxaAprovacao": 92,
    "mediaHorasPorAluno": 17,
    "pendentesFila": 5
  }
}
```

---

## ⚠️ Códigos de Status HTTP

| Código | Status | Descrição |
|---|---|---|
| `200` | OK | Requisição bem-sucedida |
| `201` | Created | Recurso criado com sucesso |
| `400` | Bad Request | Dados inválidos ou ausentes |
| `401` | Unauthorized | Token ausente ou inválido |
| `403` | Forbidden | Perfil sem permissão para a rota |
| `404` | Not Found | Recurso não encontrado |
| `500` | Internal Server Error | Erro interno do servidor |

---

## 🧪 Testando a API

Recomendamos as seguintes ferramentas para testar os endpoints:

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) *(extensão VS Code)*
- [Insomnia](https://insomnia.rest/)

### Exemplo de requisição com token (cURL)
```bash
curl -X GET https://seu-projeto.onrender.com/api/certificados/meus \
  -H "Authorization: Bearer <seu_token_aqui>" \
  -H "Content-Type: application/json"
```

---

## 🌐 Compatibilidade

A API pode ser consumida por qualquer cliente HTTP:

| Plataforma | Compatível |
|---|---|
| 🌐 Web (PWA) | ✅ |
| 📱 Mobile (React Native) | ✅ |
| 🖥️ Desktop | ✅ |
| 🔗 Integrações externas | ✅ |

---

<div align="center">

**SGH — Sistema de Gestão de Horas Complementares**  
Projeto Integrador · 3° Período · Análise e Desenvolvimento de Sistemas

</div>
