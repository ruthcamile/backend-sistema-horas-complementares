import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardAluno = async (req: Request, res: Response): Promise<any> => {
  try {
    
    // Pegando o ID do usuário de dentro do objeto 'user' que o middleware criou!
    // Se no seu token você salvou como "id", use assim:
    const alunoId = (req as any).user.id; 
    
    // (Se por acaso você salvou como "userId" no momento do login, seria: (req as any).user.userId)

    // Se o ID ainda vier vazio, a gente para o processo antes de quebrar o Prisma
    if (!alunoId) {
       return res.status(400).json({ erro: "ID do aluno não encontrado no token." });
    }

    // 1. Quantidade de certificados enviados...
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