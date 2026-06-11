import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Como o banco (schema.prisma) não tem um campo fixo de horas totais do curso, 
// é definido aqui essa regra de negócio, fica mais facil de mudar dps
const TOTAL_HORAS_EXIGIDAS = 100; 

export const getDashboardAluno = async (req: Request, res: Response): Promise<any> => {
  try {
    const usuarioDoToken = (req as any).user;
    const alunoId = usuarioDoToken.id || usuarioDoToken.userId; 

    if (!alunoId) {
       return res.status(400).json({ erro: "O ID do aluno não veio dentro do token." });
    }

    // 1. Buscar o usuário e os cursos que ele está matriculado 
    // (para mostrar no dropdown e pegar as horas exigidas)

    const usuarioComCursos = await prisma.user.findUnique({
      where: { id: Number(alunoId) },
      include: {
        cursos: {
          include: {
            curso: true
          }
        }
      }
    });

    //  Transformar os dados dos cursos para um formato mais amigável pro frontend
    const listaDeCursos = usuarioComCursos?.cursos.map(uc => ({
      id: Number(uc.curso.id), 
      nome: uc.curso.nome,
      totalHorasExigidas: (uc.curso as any).total_horas_exigidas || (uc.curso as any).totalHorasExigidas || TOTAL_HORAS_EXIGIDAS
    })) || [];

    let totalExigido = TOTAL_HORAS_EXIGIDAS;
    if (cursoIdQuery) {
      const cursoFiltrado = listaDeCursos.find(c => c.id === Number(cursoIdQuery));
      if (cursoFiltrado) {
        totalExigido = cursoFiltrado.totalHorasExigidas;
      }
    } else if (listaDeCursos.length > 0) {
      totalExigido = listaDeCursos[0].totalHorasExigidas;
    }

    // 1. Busca todos os certificados APROVADOS do aluno e traz a Área e a Validação junto
    const certificadosAprovados = await prisma.certificado.findMany({
      where: {
        alunoId: Number(alunoId),
        validacao: { status: 'APROVADO' }
      },
      include: {
        area: true,       // nome da área (Ensino, Pesquisa...)
        validacao: true   // horas que o coordenador validou
      }
    });

    // 2. Fazendo a matemática de Agrupamento e Soma
    let horasConcluidas = 0;
    const distribuicaoMap: Record<string, number> = {};

    certificadosAprovados.forEach(cert => {
      // Pega as horas aprovadas (se não tiver, é 0)
      const horas = cert.validacao?.horasValidadas || 0;
      
      // Soma no total geral
      horasConcluidas += horas;

      // Soma no total da categoria específica
      const nomeArea = cert.area.nome;
      if (distribuicaoMap[nomeArea]) {
        distribuicaoMap[nomeArea] += horas;
      } else {
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
      totalExigido,
      horasConcluidas,
      distribuicaoPorAtividade,
      cursos: listaDeCursos.map(c => ({ id: c.id, nome: c.nome }))
    });

  } catch (error) {
    console.error("ERRO FATAL NO DASHBOARD:", error);
    return res.status(500).json({ 
        erro: "O servidor quebrou!", 
        detalhe: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  }
};

export const getDashboardCoordenador = async (req: Request, res: Response): Promise<any> => {
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

  } catch (error) {
    console.error("Erro no dashboard do coordenador:", error);
    return res.status(500).json({ erro: "Erro ao carregar dados do coordenador." });
  }
};