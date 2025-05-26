import { fetchCreatorTests } from "@/lib/supabase/tables/tests";
import { PaginationParams, Role, SearchParams } from "@/types/globals";
import { queryOptions } from "@tanstack/react-query";

export const testsQueries = {
  all: ["tests"],
  list: (
    userId?: string,
    pagination?: PaginationParams,
    search?: SearchParams,
    role?: Role
  ) =>
    queryOptions({
      queryKey: [...testsQueries.all, "list", pagination, search],
      queryFn: () => fetchCreatorTests(userId, pagination, search, role),
      staleTime: 5 * 60 * 1000,
    }),
};
