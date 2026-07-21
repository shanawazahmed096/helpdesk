export interface UserQuery {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  department?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}