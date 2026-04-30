import { PrismaClient } from '@prisma/client';

// Cria uma única instância do Prisma Client
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Isso vai mostrar no terminal os comandos SQL que estão sendo executados
});