export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function getPagination(
  page: number,
  limit: number,
  totalRecords: number
): PaginationMeta {
  return {
    page,
    limit,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit),
    hasNextPage: page * limit < totalRecords,
    hasPreviousPage: page > 1,
  };
}

export function getPaginationOptions(
  page: number,
  limit: number
) {
  const currentPage = Math.max(1, page);
  const pageSize = Math.max(1, limit);

  return {
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  };
}