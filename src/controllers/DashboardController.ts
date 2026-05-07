import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Como o seu banco (schema.prisma) não tem um campo fixo de horas totais do curso, 
// vamos definir essa regra de negócio aqui. Fica fácil de mudar depois!
const TOTAL_HORAS_EXIGIDAS = 100; 

export const getDashboardAluno = async (req: Request, res: Response): Promise<any> => {
  try {
    const usuarioDoToken = (req as any).user;
    const alunoId = usuarioDoToken.id || usuarioDoToken.userId; 

    if (!alunoId) {
       return res.status(400).json({ erro: "O ID do aluno não veio dentro do token." });
    }

    // 1. Busca todos os certificados APROVADOS do aluno e traz a Área e a Validação junto
    const certificadosAprovados = await prisma.certificado.findMany({
      where: {
        alunoId: Number(alunoId),
        validacao: { status: 'APROVADO' }
      },
      include: {
        area: true,       // Precisamos do nome da área (Ensino, Pesquisa...)
        validacao: true   // Precisamos das horas que o coordenador validou
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
      totalExigido: TOTAL_HORAS_EXIGIDAS,
      horasConcluidas,
      distribuicaoPorAtividade 
    });

  } catch (error) {
    console.error("ERRO FATAL NO DASHBOARD:", error);
    return res.status(500).json({ 
        erro: "O servidor quebrou!", 
        detalhe: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  }
};