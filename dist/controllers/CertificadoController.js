"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificadoController = void 0;
const express_1 = require("express");
const CertificadoService_1 = require("../services/CertificadoService");
const certService = new CertificadoService_1.CertificadoService();
class CertificadoController {
    // Método de upload que já estava funcionando
    async enviar(req, res) {
        try {
            const alunoId = req.user.id;
            const urlDaImagem = req.file.location; // Pega o link completo gerado pelo S3
            const certificado = await certService.enviar(req.body, alunoId, urlDaImagem);
            return res.status(201).json(certificado);
        }
        catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    }
    // NOVO MÉTODO
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
//# sourceMappingURL=CertificadoController.js.map