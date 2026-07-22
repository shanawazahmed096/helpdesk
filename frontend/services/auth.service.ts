import { apiClient  } from "@/lib/api/client";
import { LoginRequest, LoginResponse } from "@/types/auth.types";

export const AuthService = {
  async login(data: LoginRequest) {
    const response = await apiClient .post<LoginResponse>(
      "/auth/login",
      data
    );

    return response.data;
  },
};