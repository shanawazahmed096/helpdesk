import { Prisma } from "@prisma/client";

import { DepartmentRepository } from "../repositories/department.repository.js";
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class DepartmentService {
  static async findAll(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ) {
    return DepartmentRepository.findAll(
      page,
      limit,
      search,
      sortBy,
      sortOrder
    );
  }

  static async findById(id: string) {
    const department = await DepartmentRepository.findById(id);

    if (!department) {
      throw new NotFoundError("Department not found");
    }

    return department;
  }

  static async create(
    data: Prisma.DepartmentUncheckedCreateInput
  ) {
    const existing = await DepartmentRepository.findByName(data.name);

    if (existing) {
      throw new ConflictError("Department name already exists");
    }

    return DepartmentRepository.create(data);
  }

  static async update(
    id: string,
    data: Prisma.DepartmentUncheckedUpdateInput
  ) {
    const department = await DepartmentRepository.findById(id);

    if (!department) {
      throw new NotFoundError("Department not found");
    }

    if (data.name && typeof data.name === "string") {
      const existing = await DepartmentRepository.findByName(data.name);

      if (existing && existing.id !== id) {
        throw new ConflictError("Department name already exists");
      }
    }

    return DepartmentRepository.update(id, data);
  }

  static async delete(id: string) {
    const department = await DepartmentRepository.findById(id);

    if (!department) {
      throw new NotFoundError("Department not found");
    }

    // Business Rule
    if (department._count.users > 0) {
      throw new ConflictError(
        "Cannot delete department with assigned users"
      );
    }

    return DepartmentRepository.softDelete(id);
  }
}