import { UsersRepository } from "../repositories/users.repository.js";
import { NotFoundError } from "../../src/errors/NotFoundError.js";


import bcrypt from "bcrypt";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "../validators/users.validators.js";
import { ConflictError } from "../errors/ConflictError.js";

export class UsersService {
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
    return UsersRepository.findAll(page, limit, search, role, departmentId, isActive, sortBy, sortOrder);
  }

  static async findById(id: string) {
    const user = await UsersRepository.findById(id);

    if (!user) {
    throw new NotFoundError("User not found");
    }

    return user;
  }

  static async create(payload: CreateUserInput) {
    // Check if email already exists
    const existingUser = await UsersRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    // Check role
    const role = await UsersRepository.findRoleById(payload.roleId);

    if (!role) {
      throw new Error("Role not found");
    }

    // Check department (optional)
    if (payload.departmentId) {
      const department = await UsersRepository.findDepartmentById(
        payload.departmentId
      );

      if (!department) {
        throw new Error("Department not found");
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(payload.password, 12);

    // Create user
    const userData = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email.toLowerCase(),
      passwordHash,
      roleId: payload.roleId,

      ...(payload.phone ? { phone: payload.phone } : {}),
      ...(payload.avatarUrl ? { avatarUrl: payload.avatarUrl } : {}),
      ...(payload.departmentId
        ? { departmentId: payload.departmentId }
        : {}),
    };

    return UsersRepository.create(userData);
  }

  static async update(id: string, payload: UpdateUserInput) {
  // Check if user exists
  const existingUser = await UsersRepository.findById(id);

  if (!existingUser) {
    throw new NotFoundError("User not found");
  }

  // Check duplicate email
  if (payload.email && payload.email !== existingUser.email) {
    const emailExists = await UsersRepository.findByEmail(payload.email);

    if (emailExists) {
      throw new ConflictError("Email already exists");
    }
  }

  // Validate role
  if (payload.roleId) {
    const role = await UsersRepository.findRoleById(payload.roleId);

    if (!role) {
      throw new Error("Role not found");
    }
  }

  // Validate department
  if (payload.departmentId) {
    const department = await UsersRepository.findDepartmentById(
      payload.departmentId
    );

    if (!department) {
      throw new Error("Department not found");
    }
  }

  const updateData = {
    ...(payload.firstName && { firstName: payload.firstName }),
    ...(payload.lastName && { lastName: payload.lastName }),
    ...(payload.email && { email: payload.email.toLowerCase() }),
    ...(payload.phone !== undefined && { phone: payload.phone }),
    ...(payload.avatarUrl !== undefined && {
      avatarUrl: payload.avatarUrl,
    }),
    ...(payload.roleId && { roleId: payload.roleId }),
    ...(payload.departmentId !== undefined && {
      departmentId: payload.departmentId,
    }),
    ...(payload.isActive !== undefined && {
      isActive: payload.isActive,
    }),
  };

  return UsersRepository.update(id, updateData);
}
  

static async delete(id: string) {
  const user = await UsersRepository.findById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  await UsersRepository.softDelete(id);

  return {
    message: "User deleted successfully.",
  };
}


}