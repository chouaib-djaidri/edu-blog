import { fetchUsers } from "@/lib/supabase/tables/users";
import { PaginationParams, SearchParams } from "@/types/globals";
import { queryOptions } from "@tanstack/react-query";

export const usersQueries = {
  all: ["users"],
  list: (pagination?: PaginationParams, search?: SearchParams) =>
    queryOptions({
      queryKey: [...usersQueries.all, "list", pagination, search],
      queryFn: () => fetchUsers(pagination, search),
      staleTime: 5 * 60 * 1000,
    }),
};
