import { Prisma } from "@prisma/client";

import { RolesRepository } from "../repositories/roles.repository.js";
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class RolesService {
  static async findAll(
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ) {
    return RolesRepository.findAll(
      page,
      limit,
      search,
      isActive,
      sortBy,
      sortOrder
    );
  }

  static async findById(id: string) {
    const role = await RolesRepository.findById(id);

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    return role;
  }

  static async create(data: Prisma.RoleUncheckedCreateInput) {
    const existingCode = await RolesRepository.findByCode(data.code);

    if (existingCode) {
      throw new ConflictError("Role code already exists");
    }

    const existingName = await RolesRepository.findByName(data.name);

    if (existingName) {
      throw new ConflictError("Role name already exists");
    }

    return RolesRepository.create(data);
  }

  static async update(
    id: string,
    data: Prisma.RoleUncheckedUpdateInput
  ) {
    const role = await RolesRepository.findById(id);

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    if (data.code && typeof data.code === "string") {
      const existing = await RolesRepository.findByCode(data.code);

      if (existing && existing.id !== id) {
        throw new ConflictError("Role code already exists");
      }
    }

    if (data.name && typeof data.name === "string") {
      const existing = await RolesRepository.findByName(data.name);

      if (existing && existing.id !== id) {
        throw new ConflictError("Role name already exists");
      }
    }

    return RolesRepository.update(id, data);
  }

  static async delete(id: string) {
    const role = await RolesRepository.findById(id);

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    return RolesRepository.softDelete(id);
  }
}