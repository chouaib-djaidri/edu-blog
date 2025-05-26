import { UserProps } from "@/components/data-table/users/types";
import {
  PaginatedResponse,
  PaginationParams,
  SearchParams,
} from "@/types/globals";
import { supabaseClient } from "../client";
import { normalizeUser } from "@/lib/normalizations";
import { deleteUserById, deleteUsersById } from "@/actions/admin/users";
import { createFormData } from "@/lib/utils";

export const fetchUsers = async (
  pagination?: PaginationParams,
  search?: SearchParams
): Promise<PaginatedResponse<UserProps>> => {
  try {
    const supabase = supabaseClient();

    const { data: countData, error: countError } = await supabase.rpc(
      "get_users_count",
      {
        search_term: search?.searchTerm,
        search_levels: search?.levels,
        search_roles: search?.roles,
      }
    );

    if (countError) {
      return { data: [], totalCount: 0, pageCount: 0 };
    }

    const totalCount = countData || 0;

    const { data: usersData, error: usersError } = await supabase.rpc(
      "get_all_users",
      {
        page_number: pagination?.page || 0,
        page_size: pagination?.pageSize || 10,
        search_term: search?.searchTerm,
        search_levels: search?.levels,
        search_roles: search?.roles,
      }
    );

    if (usersError) {
      return { data: [], totalCount: 0, pageCount: 0 };
    }

    const pageCount = pagination
      ? Math.ceil(totalCount / pagination.pageSize)
      : 1;

    return {
      data: usersData.map(normalizeUser),
      totalCount,
      pageCount,
    };
  } catch {
    return { data: [], totalCount: 0, pageCount: 0 };
  }
};

export async function deleteUser(userId: string): Promise<void> {
  const formData = createFormData({ userId });
  const state = await deleteUserById(formData);
  if (state.err) {
    throw new Error("Can not delete this test");
  }
}

export async function deleteMultipleUsers(userId: string[]): Promise<void> {
  const formData = createFormData({ userId });
  const state = await deleteUsersById(formData);
  if (state.err) {
    throw new Error("Can not delete this test");
  }
}
