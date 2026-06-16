"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardCoordenador = exports.getDashboardAluno = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Como o banco (schema.prisma) não tem um campo fixo de horas totais do curso, 
// é definido aqui essa regra de negócio, fica mais facil de mudar dps
const TOTAL_HORAS_EXIGIDAS = 100;
const getDashboardAluno = async (req, res) => {
    try {
        const usuarioDoToken = req.user;
        const alunoId = usuarioDoToken.id || usuarioDoToken.userId;
        // NOVO: Pega o cursoId da URL se existir
        const { cursoId } = req.query;
        if (!alunoId) {
            return res.status(400).json({ erro: "O ID do aluno não veio dentro do token." });
        }
        // NOVO: Monta a cláusula where dinamicamente
        const whereClause = {
            alunoId: Number(alunoId),
            validacao: { status: 'APROVADO' }
        };
        if (cursoId) {
            whereClause.cursoId = Number(cursoId);
        }
        // 1. Busca os certificados usando o whereClause dinâmico
        const certificadosAprovados = await prisma.certificado.findMany({
            where: whereClause,
            include: {
                area: true,
                validacao: true
            }
        });
        // 2. Fazendo a matemática de Agrupamento e Soma
        let horasConcluidas = 0;
        const distribuicaoMap = {};
        certificadosAprovados.forEach(cert => {
            // Pega as horas aprovadas (se não tiver, é 0)
            const horas = cert.validacao?.horasValidadas || 0;
            // Soma no total geral
            horasConcluidas += horas;
            // Soma no total da categoria específica
            const nomeArea = cert.area.nome;
            if (distribuicaoMap[nomeArea]) {
                distribuicaoMap[nomeArea] += horas;
            }
            else {
                distribuicaoMap[nomeArea] = horas;
            }
        });
        // 3. Transforma o mapa de volta num formato de lista para o Frontend fazer o map()
        // [{ area: "Ensino", horas: 40 }, { area: "Pesquisa e Inovacao", horas: 60 }]
        const distribuicaoPorAtividade = Object.keys(distribuicaoMap).map(key => ({
            area: key,
            horas: distribuicaoMap[key]
        }));
        // Retorna o JSON prontinho!
        return res.json({
            totalExigido: TOTAL_HORAS_EXIGIDAS,
            horasConcluidas,
            distribuicaoPorAtividade
        });
    }
    catch (error) {
        console.error("ERRO FATAL NO DASHBOARD:", error);
        return res.status(500).json({
            erro: "O servidor quebrou!",
            detalhe: error instanceof Error ? error.message : "Erro desconhecido"
        });
    }
};
exports.getDashboardAluno = getDashboardAluno;
const getDashboardCoordenador = async (req, res) => {
    try {
        // 1. Contagem Total de Alunos (Apenas quem tem role ALUNO)
        const totalAlunos = await prisma.user.count({
            where: { role: 'ALUNO' }
        });
        // 2. Contagens de Certificados por Status (Geral de todos os alunos)
        const pendentes = await prisma.validacao.count({ where: { status: 'PENDENTE' } });
        const aprovados = await prisma.validacao.count({ where: { status: 'APROVADO' } });
        const recusados = await prisma.validacao.count({ where: { status: 'RECUSADO' } });
        // 3. Soma total de horas validadas no curso inteiro
        const somaTotalHoras = await prisma.validacao.aggregate({
            _sum: { horasValidadas: true },
            where: { status: 'APROVADO' }
        });
        const horasTotaisValidadas = somaTotalHoras._sum.horasValidadas || 0;
        // 4. Distribuição de Horas por Área (Gráfico de Barras)
        // Buscamos as áreas e somamos as horas validadas de cada uma
        const areas = await prisma.areaAtividade.findMany({
            include: {
                certificados: {
                    where: { validacao: { status: 'APROVADO' } },
                    include: { validacao: true }
                }
            }
        });
        const distribuicaoPorArea = areas.map(area => {
            const somaHorasArea = area.certificados.reduce((acc, cert) => {
                return acc + (cert.validacao?.horasValidadas || 0);
            }, 0);
            return { nome: area.nome, horas: somaHorasArea };
        });
        // 5. Cálculos das Métricas Inferiores (Matemática de Negócio)
        // Taxa de Aprovação: (Aprovados / Total Avaliados) * 100
        const totalAvaliados = aprovados + recusados;
        const taxaAprovacao = totalAvaliados > 0 ? Math.round((aprovados / totalAvaliados) * 100) : 0;
        // Média de Horas por Aluno: (Total de Horas / Total de Alunos)
        const mediaHorasPorAluno = totalAlunos > 0 ? Math.round(horasTotaisValidadas / totalAlunos) : 0;
        // Retorna o pacotão de dados para o coordenador
        return res.json({
            cards: {
                totalAlunos,
                pendentes,
                aprovados,
                recusados,
                horasTotaisValidadas
            },
            grafico: distribuicaoPorArea,
            metricas: {
                taxaAprovacao,
                mediaHorasPorAluno,
                pendentesFila: pendentes // O mesmo valor do card
            }
        });
    }
    catch (error) {
        console.error("Erro no dashboard do coordenador:", error);
        return res.status(500).json({ erro: "Erro ao carregar dados do coordenador." });
    }
};
exports.getDashboardCoordenador = getDashboardCoordenador;
