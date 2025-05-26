"use client";

import { TestProps } from "@/components/data-table/tests/types";
import { normalizeTest } from "@/lib/normalizations";
import {
  PaginatedResponse,
  PaginationParams,
  Role,
  SearchParams,
} from "@/types/globals";
import { supabaseClient } from "../client";

export const fetchCreatorTests = async (
  userId?: string,
  pagination?: PaginationParams,
  search?: SearchParams,
  role: Role = Role.CREATOR
): Promise<PaginatedResponse<TestProps>> => {
  if (role !== Role.ADMIN && !userId) {
    return { data: [], totalCount: 0, pageCount: 0 };
  }
  const supabase = supabaseClient();
  const from = pagination ? pagination.page * pagination.pageSize : 0;
  const to = pagination ? from + pagination.pageSize - 1 : 999999;

  let baseQuery = supabase
    .from("tests_with_profiles")
    .select("*", { count: "exact" });

  console.log(role);
  if (role !== Role.ADMIN) {
    baseQuery = baseQuery.eq("user_id", userId as string);
  }

  if (search?.searchTerm) {
    baseQuery = baseQuery.ilike("title", `%${search.searchTerm}%`);
  }
  if (search?.levels && search.levels.length > 0) {
    baseQuery = baseQuery.in("level", search.levels);
  }

  const { count } = await baseQuery;

  let dataQuery = supabase.from("tests_with_profiles").select("*");

  if (role !== Role.ADMIN) {
    dataQuery = dataQuery.eq("user_id", userId as string);
  }

  if (search?.searchTerm) {
    dataQuery = dataQuery.ilike("title", `%${search.searchTerm}%`);
  }
  if (search?.levels && search.levels.length > 0) {
    dataQuery = dataQuery.in("level", search.levels);
  }

  dataQuery = dataQuery.order("created_at", { ascending: false });

  if (pagination) {
    dataQuery = dataQuery.range(from, to);
  }

  const { data, error } = await dataQuery;
  if (error) {
    return { data: [], totalCount: 0, pageCount: 0 };
  }

  const totalCount = count || 0;
  const pageCount = pagination
    ? Math.ceil(totalCount / pagination.pageSize)
    : 1;

  return {
    data: data.map((el) => normalizeTest(el)),
    totalCount,
    pageCount,
  };
};

export async function deleteTest(testId: string): Promise<void> {
  const supabase = supabaseClient();
  const { error } = await supabase.from("tests").delete().eq("id", testId);
  if (error) {
    throw new Error("Can not delete this test");
  }
}

export async function deleteMultipleTests(testsIds: string[]): Promise<void> {
  const supabase = supabaseClient();
  const { error } = await supabase.from("tests").delete().in("id", testsIds);
  if (error) {
    throw new Error("Can not delete tests");
  }
}
