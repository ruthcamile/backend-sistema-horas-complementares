import { Request, Response } from 'express';
import { CertificadoService } from '../services/CertificadoService';
import { prisma } from '../database/prisma';

const certService = new CertificadoService();

// MÉTODO: Area de Atividade para o formulário de envio de certificado
export const listarAreas = async (req: Request, res: Response): Promise<any> => {
  try {
    const areas = await prisma.areaAtividade.findMany({
      select: { id: true, nome: true }
    });
    
    return res.json(areas);
  } catch (error) {
    console.error("Erro ao buscar áreas:", error);
    return res.status(500).json({ erro: "Erro ao buscar as áreas de atividade." });
  }
};

export class CertificadoController {
  
  // Método de upload que já estava funcionando
  async enviar(req: Request, res: Response) {
    try {
      const alunoId = (req as any).user.id; 
      const urlDaImagem = (req.file as any).location; // Pega o link completo gerado pelo S3

      const certificado = await certService.enviar(req.body, alunoId, urlDaImagem);

      return res.status(201).json(certificado);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // NOVO MÉTODO
  async listarMeus(req: Request, res: Response) {
    try {
      const alunoId = (req as any).user.id; 
      
      const dados = await certService.listarMeus(alunoId);

      return res.status(200).json(dados);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

// NOVO MÉTODO: Fila do Coordenador
  async listarPendentes(req: Request, res: Response) {
    try {
      
      const pendentes = await certService.listarPendentes();

      return res.status(200).json(pendentes);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // NOVO MÉTODO: Controlador de Validação
  async validar(req: Request, res: Response) {
    try {
      // Pega o ID que vem na URL (ex: /api/certificados/1/validar)
      const { id } = req.params; 
      
      // Pega os dados do corpo da requisição JSON
      const { status, horasValidadas } = req.body;

      const resultado = await certService.validarCertificado(Number(id), status, horasValidadas);

      return res.status(200).json({ 
        mensagem: 'Validação processada com sucesso!', 
        resultado 
      });
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }
}