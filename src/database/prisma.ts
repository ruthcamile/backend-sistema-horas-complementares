import { PrismaClient } from '@prisma/client';

// Criação da instância do Prisma Client
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Isso vai mostrar os comandos SQL que estão sendo executados
});