"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificadoController = exports.listarAreas = void 0;
const CertificadoService_1 = require("../services/CertificadoService");
const prisma_1 = require("../database/prisma");
const certService = new CertificadoService_1.CertificadoService();
// Esse método é para listar as áreas de atividade e suas subcategorias, usado no formulário de envio de certificado
const listarAreas = async (req, res) => {
    try {
        const areas = await prisma_1.prisma.areaAtividade.findMany({
            select: {
                id: true,
                nome: true,
                subcategorias: {
                    select: { id: true, nome: true }
                }
            }
        });
        return res.json(areas);
    }
    catch (error) {
        console.error("Erro ao buscar áreas:", error);
        return res.status(500).json({ erro: "Erro ao buscar as áreas de atividade." });
    }
};
exports.listarAreas = listarAreas;
class CertificadoController {
    // 3. NOVO MÉTODO: Detalhes do Certificado
    async detalhar(req, res) {
        try {
            const { id } = req.params;
            const certificado = await prisma_1.prisma.certificado.findUnique({
                where: { id: Number(id) },
                include: {
                    area: true,
                    subcategoria: true,
                    curso: true,
                    validacao: true // Traz o histórico, incluindo observação de recusa
                }
            });
            if (!certificado)
                return res.status(404).json({ erro: "Certificado não encontrado." });
            return res.json(certificado);
        }
        catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar detalhes do certificado." });
        }
    }
    // Método de upload
    async enviar(req, res) {
        try {
            const alunoId = req.user.id;
            const urlDaImagem = req.file.location || req.file.path;
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
        }
        catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
    // MÉTODO RECUPERADO: Lista os certificados do aluno
    async listarMeus(req, res) {
        try {
            const alunoId = req.user.id;
            const dados = await certService.listarMeus(alunoId);
            return res.status(200).json(dados);
        }
        catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
    // NOVO MÉTODO
    async listarMeusCursos(req, res) {
        try {
            const alunoId = req.user.id;
            // Busca na tabela pivô trazendo os dados do curso junto
            const vinculos = await prisma_1.prisma.usuariosCursos.findMany({
                where: { usuarioId: Number(alunoId) },
                include: { curso: true }
            });
            // Mapeia para retornar apenas a lista de cursos limpa pro front
            const cursos = vinculos.map(v => v.curso);
            return res.json(cursos);
        }
        catch (error) {
            return res.status(500).json({ erro: "Erro ao buscar cursos." });
        }
    }
    // NOVO MÉTODO: Fila do Coordenador
    async listarPendentes(req, res) {
        try {
            const pendentes = await certService.listarPendentes();
            return res.status(200).json(pendentes);
        }
        catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
    // NOVO MÉTODO: Controlador de Validação
    async validar(req, res) {
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
        }
        catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
}
exports.CertificadoController = CertificadoController;
