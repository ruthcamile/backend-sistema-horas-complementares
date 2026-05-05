import { Prisma } from '@prisma/client';
export declare class UserRepository {
    findByEmail(email: string): Promise<{
        id: number;
        email: string;
        matricula: string | null;
        nome: string;
        senha: string;
        role: import(".prisma/client").$Enums.Role;
        departamento: string | null;
    } | null>;
    create(data: Prisma.UserCreateInput): Promise<{
        id: number;
        email: string;
        matricula: string | null;
        nome: string;
        senha: string;
        role: import(".prisma/client").$Enums.Role;
        departamento: string | null;
    }>;
}
//# sourceMappingURL=UserRepository.d.ts.map