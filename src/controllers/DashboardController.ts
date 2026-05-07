import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardAluno = async (req: Request, res: Response): Promise<any> => {
  try {
    // ⚠️ Mude req.userId para a forma como o seu authMiddleware guarda o ID do usuário
    const alunoId = (req as any).userId; 

    // 1. Quantidade de certificados enviados (Total geral daquele aluno)
    const totalEnviados = await prisma.certificado.count({
      where: { alunoId: Number(alunoId) }
    });

    // 2. Quantidade de certificados aprovados
    const totalAprovados = await prisma.certificado.count({
      where: {
        alunoId: Number(alunoId),
        validacao: {
          status: 'APROVADO'
        }
      }
    });

    // 3. Carga horária acumulada (Soma das horas apenas dos aprovados)
    const agregacaoHoras = await prisma.validacao.aggregate({
      _sum: {
        horasValidadas: true
      },
      where: {
        status: 'APROVADO',
        certificado: {
          alunoId: Number(alunoId)
        }
      }
    });

    // Se o aluno não tiver nada aprovado ainda, a soma vem como null, então garantimos que retorne 0
    const horasAcumuladas = agregacaoHoras._sum.horasValidadas || 0;

    // Retorna o JSON prontinho para o Frontend
    return res.json({
      totalEnviados,
      totalAprovados,
      horasAcumuladas
    });

  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    return res.status(500).json({ erro: "Erro interno ao carregar os dados do dashboard." });
  }
};