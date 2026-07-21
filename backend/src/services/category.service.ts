import { Prisma } from "@prisma/client";
import { CategoryRepository } from "../repositories/category.repository.js";
import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { DepartmentRepository } from "../repositories/department.repository.js";

export class CategoryService {
    static async findAll(
        page: number,
        limit: number,
        search?: string,
        isActive?: boolean,
        sortBy = "createdAt",
        sortOrder: "asc" | "desc" = "desc"
    ) {
        return CategoryRepository.findAll(
            page,
            limit,
            search,
            isActive,
            sortBy,
            sortOrder
        );
    }

    static async findById(id: string) {
        const category = await CategoryRepository.findById(id);

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        return category;
    }

    static async create(
        data: Prisma.CategoryUncheckedCreateInput
    ) {
        const existing = await CategoryRepository.findByName(
            data.departmentId,
            data.name
        );

        if (existing) {
            throw new ConflictError("Category already exists");
        }
        const department = await DepartmentRepository.findById(data.departmentId);

        if (!department) {
            throw new NotFoundError("Department not found.");
        }
        return CategoryRepository.create(data);
    }

static async update(
    id: string,
    data: Prisma.CategoryUncheckedUpdateInput
) {
    const category = await CategoryRepository.findById(id);

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    // Validate department if departmentId is being changed
    if (typeof data.departmentId === "string") {
        const department = await DepartmentRepository.findById(
            data.departmentId
        );

        if (!department) {
            throw new NotFoundError("Department not found.");
        }
    }

    // Check duplicate category
    if (typeof data.name === "string") {

        const departmentId =
            typeof data.departmentId === "string"
                ? data.departmentId
                : category.department.id;

        const existing = await CategoryRepository.findByName(
            departmentId,
            data.name
        );

        if (existing && existing.id !== id) {
            throw new ConflictError("Category already exists");
        }
    }

    return CategoryRepository.update(id, data);
}

    static async delete(id: string) {
        const category = await CategoryRepository.findById(id);

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        if (category._count.tickets > 0) {
            throw new ConflictError(
                "Cannot delete category with assigned tickets"
            );
        }

        await CategoryRepository.softDelete(id);
    }
}