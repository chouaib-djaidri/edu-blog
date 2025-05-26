import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  type Table as TableType,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { BlogCategory, BlogProps, BlogStatus } from "./types";
import { blogsQueries } from "./queries";
import { useUser } from "@/context/user";
import { Loader2Icon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslations } from "next-intl";

interface BlogsTableContentProps {
  columns: ColumnDef<BlogProps>[];
  table: TableType<BlogProps>;
  onDataChange: (data: BlogProps[]) => void;
  onTotalCountChange: (count: number) => void;
}

export function BlogsTableContent({
  columns,
  table,
  onDataChange,
  onTotalCountChange,
}: BlogsTableContentProps) {
  const t = useTranslations("Pagination");
  const { userData } = useUser();
  const pagination = table.getState().pagination;
  const columnFilters = table.getState().columnFilters;
  
  const titleFilter =
    (columnFilters.find((filter) => filter.id === "title")?.value as string) ||
    "";
  const debouncedTitleFilter = useDebounce(titleFilter, 500);
  
  const statusFilter = columnFilters.find((filter) => filter.id === "status")
    ?.value as BlogStatus[];
  
  const categoryFilter = columnFilters.find((filter) => filter.id === "categories")
    ?.value as BlogCategory[];

  const search = {
    searchTerm: debouncedTitleFilter || undefined,
    status: statusFilter || undefined,
    categories: categoryFilter || undefined,
  };

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...blogsQueries.list(
      userData?.id,
      {
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      search,
      userData?.role
    ),
  });

  useEffect(() => {
    if (data) {
      onDataChange(data.data);
      onTotalCountChange(data.totalCount);
    }
  }, [onDataChange, onTotalCountChange, data]);

  useEffect(() => {
    if (debouncedTitleFilter !== titleFilter) {
      table.setPageIndex(0);
    }
  }, [debouncedTitleFilter, titleFilter, table]);

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
