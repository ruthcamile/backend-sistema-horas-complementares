"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificadoRepository = void 0;
const prisma_1 = require("../database/prisma");
class CertificadoRepository {
    // src/repositories/CertificadoRepository.ts
    // MÉTODO DE CRIAÇÃO DE CERTIFICADO ATUALIZADO
    async create(dados, alunoId, urlDaImagem) {
        return await prisma_1.prisma.certificado.create({
            data: {
                tituloAtividade: dados.tituloAtividade,
                cargaHorariaInformada: Number(dados.cargaHorariaInformada),
                dataAtividade: new Date(dados.dataAtividade),
                arquivoImagem: urlDaImagem,
                // 1. Jeito correto de relacionar o Aluno e a Área no Prisma (Evita o erro "Argument aluno is missing")
                aluno: {
                    connect: { id: Number(alunoId) }
                },
                area: {
                    connect: { id: Number(dados.areaId) }
                },
                // 2. ADICIONADO: Enviando os novos campos obrigatórios que vieram do formulário!
                curso: {
                    connect: { id: Number(dados.cursoId) }
                },
                subcategoria: {
                    connect: { id: Number(dados.subcategoriaId) }
                },
                // Sua validação aninhada (que causava o conflito com os IDs puros)
                validacao: {
                    create: {
                        status: "PENDENTE",
                        horasValidadas: 0
                    }
                }
            }
        });
    }
    // NOVO MÉTODO PARA O DASHBOARD DO ALUNO
    async findByAlunoId(alunoId) {
        const certificados = await prisma_1.prisma.certificado.findMany({
            where: { alunoId: alunoId },
            include: {
                area: true, // Traz os dados da Área (nome, limite de horas)
                validacao: true // Traz o status (PENDENTE, APROVADO, etc)
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
        return await prisma_1.prisma.certificado.findMany({
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
    async atualizarValidacao(certificadoId, status, horasValidadas) {
        // Como a relação é 1:1, podemos dar o update direto no registro de validação
        // atrelado a este certificadoId específico.
        return await prisma_1.prisma.validacao.update({
            where: { certificadoId: certificadoId },
            data: {
                status: status,
                horasValidadas: horasValidadas,
                dataValidacao: new Date() // Grava o timestamp exato da aprovação/recusa
            }
        });
    }
}
exports.CertificadoRepository = CertificadoRepository;
