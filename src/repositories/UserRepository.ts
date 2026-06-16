// src/repositories/UserRepository.ts

import { prisma } from '../database/prisma';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: any) {
    return await prisma.user.create({ data });
  }
}