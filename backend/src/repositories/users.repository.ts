import prisma from "../config/prisma.js";
import { Prisma, type Role } from "@prisma/client";


export class UsersRepository {
  static async findAll(
    page: number,
    limit: number,
    search?: string,
    role?: string,
    departmentId?: string,
    isActive?: boolean,
    sortBy?: string,
    sortOrder?: string
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,

      ...(search
        ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              lastName: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
        : {}),
      ...(role
        ? {
          role: {
            is: {
              code: role,
            },
          },
        }
        : {}),
      ...(departmentId
        ? {
          departmentId,
        }
        : {}),
      ...(isActive !== undefined
        ? {
          isActive,
        }
        : {}),
    };
    console.log("WHERE =", JSON.stringify(where, null, 2));
    const orderBy: Prisma.UserOrderByWithRelationInput = {};

    switch (sortBy) {
      case "firstName":
        orderBy.firstName = sortOrder === "asc" ? "asc" : "desc";
        break;

      case "lastName":
        orderBy.lastName = sortOrder === "asc" ? "asc" : "desc";
        break;

      case "email":
        orderBy.email = sortOrder === "asc" ? "asc" : "desc";
        break;

      case "updatedAt":
        orderBy.updatedAt = sortOrder === "asc" ? "asc" : "desc";
        break;

      case "createdAt":
      default:
        orderBy.createdAt = sortOrder === "asc" ? "asc" : "desc";
    }
    const [users, totalRecords] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatarUrl: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,

          role: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },

          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return {
      users,
      totalRecords,
    };
  }

  static async findById(id: string) {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,

        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        deletedAt: null,
      },
    });
  }

  static async findRoleById(roleId: string) {
    return prisma.role.findFirst({
      where: {
        id: roleId,
        deletedAt: null,
      },
    });
  }

  static async findDepartmentById(departmentId: string) {
    return prisma.department.findFirst({
      where: {
        id: departmentId,
        deletedAt: null,
      },
    });
  }

  static async create(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatarUrl: true,
      isActive: true,
      createdAt: true,

      role: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },

      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

static async update(
  id: string,
  data: Prisma.UserUncheckedUpdateInput
) {
  return prisma.user.update({
    where: {
      id,
      deletedAt: null,
    },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatarUrl: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,

      role: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },

      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

static async softDelete(id: string) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

}