export declare class CertificadoRepository {
    create(dados: any, alunoId: number, urlDaImagem: string): Promise<{
        id: number;
        tituloAtividade: string;
        cargaHorariaInformada: number;
        dataAtividade: Date;
        arquivoImagem: string;
        dataEnvio: Date;
        areaId: number;
        alunoId: number;
    }>;
    findByAlunoId(alunoId: number): Promise<{
        resumo: {
            totalEnviados: number;
            totalAprovados: number;
            totalRecusados: number;
            totalPendente: number;
            horasValidadas: number;
        };
        certificados: ({
            area: {
                id: number;
                nome: string;
                limiteHorasArea: number;
            };
            validacao: {
                id: number;
                status: import(".prisma/client").$Enums.StatusValidacao;
                observacao: string | null;
                horasValidadas: number | null;
                dataValidacao: Date | null;
                certificadoId: number;
            } | null;
        } & {
            id: number;
            tituloAtividade: string;
            cargaHorariaInformada: number;
            dataAtividade: Date;
            arquivoImagem: string;
            dataEnvio: Date;
            areaId: number;
            alunoId: number;
        })[];
    }>;
    findPendentes(): Promise<({
        area: {
            id: number;
            nome: string;
            limiteHorasArea: number;
        };
        validacao: {
            id: number;
            status: import(".prisma/client").$Enums.StatusValidacao;
            observacao: string | null;
            horasValidadas: number | null;
            dataValidacao: Date | null;
            certificadoId: number;
        } | null;
        aluno: {
            id: number;
            email: string;
            nome: string;
        };
    } & {
        id: number;
        tituloAtividade: string;
        cargaHorariaInformada: number;
        dataAtividade: Date;
        arquivoImagem: string;
        dataEnvio: Date;
        areaId: number;
        alunoId: number;
    })[]>;
    atualizarValidacao(certificadoId: number, status: 'APROVADO' | 'RECUSADO', horasValidadas: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusValidacao;
        observacao: string | null;
        horasValidadas: number | null;
        dataValidacao: Date | null;
        certificadoId: number;
    }>;
}
//# sourceMappingURL=CertificadoRepository.d.ts.map