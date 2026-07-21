import prisma from "../config/prisma.js";

// const prisma = new PrismaClient();

export const AuthRepository = {
    findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
                department: true,
            },
        });
    },

    findUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                department: true,
            },
        });
    },

    createRefreshToken(data: {
        jti: string;
        tokenHash: string;
        userId: string;
        expiresAt: Date;
    }) {
        return prisma.refreshToken.create({
            data,
        });
    },

    findRefreshTokenByJti(jti: string) {
        return prisma.refreshToken.findUnique({
            where: {
                jti,
            },
            include: {
                user: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    },

    revokeRefreshToken(id: string) {
        return prisma.refreshToken.update({
            where: { id },
            data: {
                revokedAt: new Date(),
            },
        });
    },

    deleteUserRefreshTokens(userId: string) {
        return prisma.refreshToken.deleteMany({
            where: { userId },
        });
    },

    findRefreshTokenByUserId(userId: string) {
        return prisma.refreshToken.findFirst({
            where: {
                userId,
                revokedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
};

