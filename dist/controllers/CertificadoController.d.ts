import { Request, Response } from 'express';
export declare class CertificadoController {
    enviar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    listarMeus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    listarPendentes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    validar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=CertificadoController.d.ts.map