"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificadoService = void 0;
const CertificadoRepository_1 = require("../repositories/CertificadoRepository");
const certRepo = new CertificadoRepository_1.CertificadoRepository();
class CertificadoService {
    // 🔥 MÉTODO CORRIGIDO E LIMPO 🔥
    async enviar(dados, alunoId, urlDaImagem) {
        // O Repository já espera exatamente esses 3 itens!
        return await certRepo.create(dados, alunoId, urlDaImagem);
    }
    // NOVO MÉTODO
    async listarMeus(alunoId) {
        return await certRepo.findByAlunoId(alunoId);
    }
    // NOVO MÉTODO: Fila do Coordenador
    async listarPendentes() {
        return await certRepo.findPendentes();
    }
    // NOVO MÉTODO: Lógica de Validação do Coordenador
    async validarCertificado(certificadoId, status, horasValidadas) {
        // 1. Valida se o status enviado é válido pelas constraints do Enum
        if (status !== 'APROVADO' && status !== 'RECUSADO') {
            throw new Error('O status deve ser estritamente APROVADO ou RECUSADO.');
        }
        // 2. Se for recusado, garantimos que as horas validadas sejam zeradas
        const horas = status === 'APROVADO' ? Number(horasValidadas) : 0;
        // 3. Executa a mutação
        return await certRepo.atualizarValidacao(certificadoId, status, horas);
    }
}
exports.CertificadoService = CertificadoService;
//# sourceMappingURL=CertificadoService.js.map