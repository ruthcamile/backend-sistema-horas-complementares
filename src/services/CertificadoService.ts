import { CertificadoRepository } from '../repositories/CertificadoRepository';

const certRepo = new CertificadoRepository();

export class CertificadoService {
  async enviar(dados: any, alunoId: number, nomeArquivo: string) {
    const { tituloAtividade, cargaHorariaInformada, dataAtividade, areaId } = dados;

    if (!nomeArquivo) {
      throw new Error('O arquivo da imagem é obrigatório.');
    }

    const certificado = await certRepo.create({
      tituloAtividade,
      cargaHorariaInformada: Number(cargaHorariaInformada),
      dataAtividade: new Date(dataAtividade),
      arquivoImagem: nomeArquivo,
      alunoId: Number(alunoId),
      areaId: Number(areaId)
    });

    return certificado;
  }
  
  // NOVO MÉTODO
  async listarMeus(alunoId: number) {
    return await certRepo.findByAlunoId(alunoId);
  }

  // NOVO MÉTODO: Fila do Coordenador
  async listarPendentes() {
    return await certRepo.findPendentes();
  }

  // NOVO MÉTODO: Lógica de Validação do Coordenador
  async validarCertificado(certificadoId: number, status: string, horasValidadas?: number) {
    // 1. Valida se o status enviado é válido pelas constraints do Enum
    if (status !== 'APROVADO' && status !== 'RECUSADO') {
      throw new Error('O status deve ser estritamente APROVADO ou RECUSADO.');
    }

    // 2. Se for recusado, garantimos que as horas validadas sejam zeradas
    const horas = status === 'APROVADO' ? Number(horasValidadas) : 0;

    // 3. Executa a mutação
    return await certRepo.atualizarValidacao(certificadoId, status as 'APROVADO' | 'RECUSADO', horas);
  }

}