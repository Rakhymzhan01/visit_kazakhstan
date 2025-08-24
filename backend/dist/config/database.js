"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Prevent multiple instances of Prisma Client in development
exports.prisma = globalThis.__prisma || new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = exports.prisma;
}
// Graceful shutdown
process.on('beforeExit', async () => {
    await exports.prisma.$disconnect();
});
exports.default = exports.prisma;
//# sourceMappingURL=database.js.map