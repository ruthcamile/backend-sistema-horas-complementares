import { Request, Response } from 'express';
import { CertificadoService } from '../services/CertificadoService';
import { prisma } from '../database/prisma';

const certService = new CertificadoService();

// Esse método é para listar as áreas de atividade e suas subcategorias, usado no formulário de envio de certificado
export const listarAreas = async (req: Request, res: Response): Promise<any> => {
  try {
    const areas = await prisma.areaAtividade.findMany({
      select: { 
        id: true, 
        nome: true,
        subcategorias: { // Traz a subcategoria junto!
          select: { id: true, nome: true }
        }
      }
    });
    
    return res.json(areas);
  } catch (error) {
    console.error("Erro ao buscar áreas:", error);
    return res.status(500).json({ erro: "Erro ao buscar as áreas de atividade." });
  }
};

export class CertificadoController {



  // 3. NOVO MÉTODO: Detalhes do Certificado
  async detalhar(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const certificado = await prisma.certificado.findUnique({
        where: { id: Number(id) },
        include: {
          area: true,
          subcategoria: true,
          curso: true,
          validacao: true // Traz o histórico, incluindo observação de recusa
        }
      });

      if (!certificado) return res.status(404).json({ erro: "Certificado não encontrado." });

      return res.json(certificado);
    } catch (error: any) {
      return res.status(500).json({ erro: "Erro ao buscar detalhes do certificado." });
    }
  }
  
  // Método de upload
  async enviar(req: Request, res: Response): Promise<any> {
    try {
      const alunoId = (req as any).user.id; 

      // Validação básica para garantir que o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ 
        erro: "O arquivo do comprovante é obrigatório para o envio do certificado." 
      });
    }
      
      const urlDaImagem = (req.file as any).location || (req.file as any).path; 

      // req.body agora deve trazer cursoId e subcategoriaId do frontend
      // Transformamos em Number pois form-data envia tudo como string
      const dadosTratados = {
        ...req.body,
        cursoId: Number(req.body.cursoId),
        subcategoriaId: Number(req.body.subcategoriaId),
        areaId: Number(req.body.areaId)
      };

      const certificado = await certService.enviar(dadosTratados, alunoId, urlDaImagem);

      return res.status(201).json(certificado);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // MÉTODO RECUPERADO: Lista os certificados do aluno
  async listarMeus(req: Request, res: Response) {
    try {
      const alunoId = (req as any).user.id; 
      
      const dados = await certService.listarMeus(alunoId);

      return res.status(200).json(dados);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // NOVO MÉTODO
  async listarMeusCursos(req: Request, res: Response): Promise<any> {
    try {
      const alunoId = (req as any).user.id;
      
      // Busca na tabela pivô trazendo os dados do curso junto
      const vinculos = await prisma.usuariosCursos.findMany({
        where: { usuarioId: Number(alunoId) },
        include: { curso: true }
      });

      // Mapeia para retornar apenas a lista de cursos limpa pro front
      const cursos = vinculos.map(v => v.curso);

      return res.json(cursos);
    } catch (error: any) {
      return res.status(500).json({ erro: "Erro ao buscar cursos." });
    }
  }

  // NOVO MÉTODO: Fila do Coordenador
  async listarPendentes(req: Request, res: Response): Promise<any> {
    try {
      const pendentes = await certService.listarPendentes();

      return res.status(200).json(pendentes);
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // NOVO MÉTODO: Controlador de Validação
  async validar(req: Request, res: Response): Promise<any> {
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
