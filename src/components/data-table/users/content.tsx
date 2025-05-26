import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { EnglishLevel, Role } from "@/types/globals";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  type Table as TableType,
} from "@tanstack/react-table";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { usersQueries } from "./queries";
import { UserProps } from "./types";
import { useTranslations } from "next-intl";

interface UsersTableContentProps {
  columns: ColumnDef<UserProps>[];
  table: TableType<UserProps>;
  onDataChange: (data: UserProps[]) => void;
  onTotalCountChange: (count: number) => void;
}

export function UsersTableContent({
  columns,
  table,
  onDataChange,
  onTotalCountChange,
}: UsersTableContentProps) {
  const t = useTranslations("Pagination");
  const pagination = table.getState().pagination;
  const columnFilters = table.getState().columnFilters;
  const searchFilter =
    (columnFilters.find((filter) => filter.id === "email")?.value as string) ||
    "";
  const debouncedSearchFilter = useDebounce(searchFilter, 500);
  const levelFilter = columnFilters.find((filter) => filter.id === "level")
    ?.value as EnglishLevel[];
  const roleFilter = columnFilters.find((filter) => filter.id === "role")
    ?.value as Role[];

  const search = {
    searchTerm: debouncedSearchFilter || undefined,
    levels: levelFilter || undefined,
    roles: roleFilter || undefined,
  };
  const { data, isLoading, isPlaceholderData } = useQuery({
    ...usersQueries.list(
      {
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      search
    ),
  });

  useEffect(() => {
    if (data) {
      onDataChange(data.data);
      onTotalCountChange(data.totalCount);
    }
  }, [onDataChange, onTotalCountChange, data]);

  useEffect(() => {
    if (debouncedSearchFilter !== searchFilter) {
      table.setPageIndex(0);
    }
  }, [debouncedSearchFilter, searchFilter, table]);

  if (isLoading && !isPlaceholderData) {
    return (
      <TableBody className="**:data-[slot=table-cell]:first:w-8">
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24">
            <div className="flex items-center justify-center">
              <Loader2Icon className="size-6 animate-spin" />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  const rows = table.getRowModel().rows;
  return (
    <TableBody className="**:data-[slot=table-cell]:first:w-8">
      {rows?.length ? (
        rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="h-24 text-center text-muted-foreground"
          >
            {t("noResult")}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
