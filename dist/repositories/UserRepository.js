"use strict";
// src/repositories/UserRepository.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../database/prisma");
const client_1 = require("@prisma/client");
class UserRepository {
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({
            where: { email },
        });
    }
    async create(data) {
        return prisma_1.prisma.user.create({
            data,
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map