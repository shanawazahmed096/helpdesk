import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export class RolesRepository {
  static async findAll(
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean,
    sortBy = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.RoleWhereInput = {
      deletedAt: null,

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
                code: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),

      ...(isActive !== undefined ? { isActive } : {}),
    };

    const [roles, totalRecords] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),

      prisma.role.count({
        where,
      }),
    ]);

    return {
      roles,
      totalRecords,
    };
  }

  static async findById(id: string) {
    return prisma.role.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  static async findByCode(code: string) {
    return prisma.role.findFirst({
      where: {
        code,
        deletedAt: null,
      },
    });
  }

  static async findByName(name: string) {
    return prisma.role.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    });
  }

  static async create(data: Prisma.RoleUncheckedCreateInput) {
    return prisma.role.create({
      data,
    });
  }

  static async update(
    id: string,
    data: Prisma.RoleUncheckedUpdateInput
  ) {
    return prisma.role.update({
      where: { id },
      data,
    });
  }

  static async softDelete(id: string) {
    return prisma.role.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}