export declare class AuthService {
    cadastrar(dados: any): Promise<{
        id: number;
        email: string;
        matricula: string | null;
        nome: string;
        senha: string;
        role: import(".prisma/client").$Enums.Role;
        departamento: string | null;
    }>;
    login(email: string, senha: string): Promise<{
        token: string;
        perfil: import(".prisma/client").$Enums.Role;
        nome: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map