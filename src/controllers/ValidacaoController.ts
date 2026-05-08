import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. Rota para CARREGAR a tela (GET)
export const listarFilaValidacao = async (req: Request, res: Response): Promise<any> => {
  try {
    // Pegando as contagens para os 3 cards do topo
    const pendentes = await prisma.validacao.count({ where: { status: 'PENDENTE' } });
    const aprovados = await prisma.validacao.count({ where: { status: 'APROVADO' } });
    const recusados = await prisma.validacao.count({ where: { status: 'RECUSADO' } });

    // Pegando a lista de certificados pendentes com os dados do Aluno e da Área
    const certificadosPendentes = await prisma.certificado.findMany({
      where: {
        validacao: { status: 'PENDENTE' }
      },
      include: {
        // Trazendo apenas o que importa do aluno por segurança (não precisa trazer a senha/token dele!)
        aluno: { 
          select: { id: true, nome: true, email: true } 
        },
        area: { 
          select: { nome: true } 
        },
        validacao: true 
      },
      // Ordena pela data de criação: os mais antigos aparecem primeiro na fila do coordenador!
      orderBy: {
        dataEnvio: 'asc'
      }
    });

    // Devolve os dados para o frontend
    return res.json({
      cards: { pendentes, aprovados, recusados },
      lista: certificadosPendentes
    });

  } catch (error) {
    console.error("Erro ao carregar fila de validação:", error);
    return res.status(500).json({ erro: "Erro ao carregar a fila de certificados." });
  }
};

// 2. Rota para EXECUTAR a validação (POST/PATCH) - Você vai precisar disso logo em seguida!
export const avaliarCertificado = async (req: Request, res: Response): Promise<any> => {
  try {
    const { idValidacao } = req.params;
    const { status, horasValidadas, observacao } = req.body;

    // O status tem que ser APROVADO ou RECUSADO
    if (status !== 'APROVADO' && status !== 'RECUSADO') {
      return res.status(400).json({ erro: "Status inválido. Use APROVADO ou RECUSADO." });
    }

    // Atualiza a tabela de validação
    const validacaoAtualizada = await prisma.validacao.update({
      where: { id: Number(idValidacao) },
      data: {
        status,
        horasValidadas: status === 'APROVADO' ? Number(horasValidadas) : 0,
        observacao: observacao || null,
        dataValidacao: new Date()
      }
    });

    return res.json({ 
      mensagem: `Certificado ${status.toLowerCase()} com sucesso!`, 
      validacao: validacaoAtualizada 
    });

  } catch (error) {
    console.error("Erro ao avaliar certificado:", error);
    return res.status(500).json({ erro: "Erro ao registrar a avaliação." });
  }
};