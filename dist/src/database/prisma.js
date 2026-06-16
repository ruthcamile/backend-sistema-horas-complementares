"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Criação da instância do Prisma Client
exports.prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Isso vai mostrar os comandos SQL que estão sendo executados
});
