import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardAluno = async (req: Request, res: Response): Promise<any> => {
  try {
    const usuarioDoToken = (req as any).user;
    console.log("1. O que veio no token?", usuarioDoToken); // Vai aparecer no terminal do VS Code/Render

    // Isso cobre as duas possibilidades de como você pode ter salvo o ID!
    const alunoId = usuarioDoToken.id || usuarioDoToken.userId; 
    console.log("2. ID do aluno extraído:", alunoId);

    if (!alunoId) {
       return res.status(400).json({ erro: "O ID do aluno não veio dentro do token." });
    }

    console.log("3. Buscando certificados enviados...");
    const totalEnviados = await prisma.certificado.count({
      where: { alunoId: Number(alunoId) }
    });

    console.log("4. Buscando certificados aprovados...");
    const totalAprovados = await prisma.certificado.count({
      where: {
        alunoId: Number(alunoId),
        validacao: { status: 'APROVADO' }
      }
    });

    console.log("5. Somando horas...");
    const agregacaoHoras = await prisma.validacao.aggregate({
      _sum: { horasValidadas: true },
      where: {
        status: 'APROVADO',
        certificado: { alunoId: Number(alunoId) }
      }
    });

    const horasAcumuladas = agregacaoHoras._sum.horasValidadas || 0;
    
    console.log("6. Sucesso absoluto! Retornando os dados.");
    return res.json({ totalEnviados, totalAprovados, horasAcumuladas });

  } catch (error) {
    console.error("❌ ERRO FATAL NO DASHBOARD:", error);
    
    // Agora ele vai mandar o ERRO VERDADEIRO para o Thunder Client!
    return res.status(500).json({ 
        erro: "O servidor quebrou!", 
        detalhe: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  }
};