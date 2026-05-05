export declare class CertificadoService {
    enviar(dados: any, alunoId: number, urlDaImagem: string): Promise<{
        id: number;
        tituloAtividade: string;
        cargaHorariaInformada: number;
        dataAtividade: Date;
        arquivoImagem: string;
        dataEnvio: Date;
        areaId: number;
        alunoId: number;
    }>;
    listarMeus(alunoId: number): Promise<{
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
    listarPendentes(): Promise<({
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
    validarCertificado(certificadoId: number, status: string, horasValidadas?: number): Promise<{
        id: number;
        status: import(".prisma/client").$Enums.StatusValidacao;
        observacao: string | null;
        horasValidadas: number | null;
        dataValidacao: Date | null;
        certificadoId: number;
    }>;
}
//# sourceMappingURL=CertificadoService.d.ts.map