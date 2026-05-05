import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class CertificadoRepository {
  
  // 🔥 O MÉTODO QUE ESTAVA FALTANDO! 🔥
  async create(dados: any, alunoId: number, urlDaImagem: string) {
    return await prisma.certificado.create({
      data: {
        tituloAtividade: dados.tituloAtividade,
        cargaHorariaInformada: Number(dados.cargaHorariaInformada),
        dataAtividade: new Date(dados.dataAtividade), // Converte a data do HTML para o formato do banco
        alunoId: alunoId,
        areaId: Number(dados.areaId),
  
        arquivoImagem: urlDaImagem, 

        // cria o certificado atrelando a validação inicial como PENDENTE e horas validadas zeradas
        validacao: {
          create: {
            status: 'PENDENTE',
            horasValidadas: 0
          }
        }
      }
    });
  }
  
  // NOVO MÉTODO PARA O DASHBOARD DO ALUNO
  async findByAlunoId(alunoId: number) {
    const certificados = await prisma.certificado.findMany({
      where: { alunoId: alunoId },
      include: {
        area: true,        // Traz os dados da Área (nome, limite de horas)
        validacao: true    // Traz o status (PENDENTE, APROVADO, etc)
      },
      orderBy: { dataEnvio: 'desc' } // Os envios mais recentes primeiro
    });

    // Matemática básica para o Dashboard!
    const totalEnviados = certificados.length;
    const totalAprovados = certificados.filter(c => c.validacao?.status === 'APROVADO').length;
    const totalRecusados = certificados.filter(c => c.validacao?.status === 'RECUSADO').length;
    const totalPendente = certificados.filter(c => c.validacao?.status === 'PENDENTE').length;

    // Soma as horas apenas dos certificados APROVADOS
    const horasValidadas = certificados
      .filter(c => c.validacao?.status === 'APROVADO')
      .reduce((acc, curr) => acc + (curr.validacao?.horasValidadas || 0), 0);

    return {
      resumo: {
        totalEnviados,
        totalAprovados,
        totalRecusados,
        totalPendente,
        horasValidadas
      },
      certificados
    };
  }

  // NOVO MÉTODO: Fila do Coordenador
  async findPendentes() {
    return await prisma.certificado.findMany({
      where: {
        validacao: {
          status: 'PENDENTE'
        }
      },
      include: {
        aluno: {
          select: { id: true, nome: true, email: true } // Traz quem enviou (sem a senha!)
        },
        area: true,
        validacao: true
      },
      orderBy: { dataEnvio: 'asc' } // Fila justa: os mais antigos primeiro (FIFO)
    });
  }

  // NOVO MÉTODO: Atualizar o status da validação
  async atualizarValidacao(certificadoId: number, status: 'APROVADO' | 'RECUSADO', horasValidadas: number) {
    // Como a relação é 1:1, podemos dar o update direto no registro de validação
    // atrelado a este certificadoId específico.
    return await prisma.validacao.update({
      where: { certificadoId: certificadoId },
      data: {
        status: status,
        horasValidadas: horasValidadas,
        dataValidacao: new Date() // Grava o timestamp exato da aprovação/recusa
      }
    });
  }

}