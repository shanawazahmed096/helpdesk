import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export class CategoryRepository {
    static async findAll(
        page: number,
        limit: number,
        search?: string,
        isActive?: boolean,
        sortBy = "createdAt",
        sortOrder: "asc" | "desc" = "desc"
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.CategoryWhereInput = {
            deletedAt: null,

            ...(isActive !== undefined
                ? {
                    isActive,
                }
                : {}),

            ...(search
                ? {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),
        };

        const [categories, totalRecords] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                include: {
                    department: {
                        select: {
                            id: true,
                            name: true
                        }
                    },

                    assignedAgent: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },

                    _count: {
                        select: {
                            tickets: true
                        }
                    }
                },
            }),

            prisma.category.count({
                where,
            }),
        ]);

        return {
            categories,
            totalRecords,
        };
    }

    static async findById(id: string) {
        return prisma.category.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true
                    }
                },

                assignedAgent: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },

                _count: {
                    select: {
                        tickets: true
                    }
                }
            },
        });
    }

    static async findByName(
        departmentId: string,
        name: string
    ) {
        return prisma.category.findFirst({
            where: {
                departmentId,
                name,
                deletedAt: null,
            },
        });
    }

    static async create(
        data: Prisma.CategoryUncheckedCreateInput
    ) {
        return prisma.category.create({
            data,
        });
    }

    static async update(
        id: string,
        data: Prisma.CategoryUncheckedUpdateInput
    ) {
        return prisma.category.update({
            where: { id },
            data,
        });
    }

    static async softDelete(id: string) {
        return prisma.category.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}