import prisma from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export class DepartmentRepository {
  static async findAll(
    page: number,
    limit: number,
    search?: string,
    sortBy = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.DepartmentWhereInput = {
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
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    };

    const [departments, totalRecords] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      }),

      prisma.department.count({
        where,
      }),
    ]);

    return {
      departments,
      totalRecords,
    };
  }

  static async findById(id: string) {
    return prisma.department.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });
  }

  static async findByName(name: string) {
    return prisma.department.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    });
  }

  static async create(
    data: Prisma.DepartmentUncheckedCreateInput
  ) {
    return prisma.department.create({
      data,
    });
  }

  static async update(
    id: string,
    data: Prisma.DepartmentUncheckedUpdateInput
  ) {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  static async softDelete(id: string) {
    return prisma.department.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}