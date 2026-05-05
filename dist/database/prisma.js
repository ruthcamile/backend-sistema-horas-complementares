"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Cria uma única instância do Prisma Client
exports.prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Isso vai mostrar no terminal os comandos SQL que estão sendo executados
});
//# sourceMappingURL=prisma.js.map