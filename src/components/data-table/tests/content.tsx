import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  type Table as TableType,
} from "@tanstack/react-table";
import { useEffect } from "react";
import { TestProps } from "./types";
import { testsQueries } from "./queries";
import { useUser } from "@/context/user";
import { Loader2Icon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { EnglishLevel } from "@/types/globals";
import { useTranslations } from "next-intl";

interface TestsTableContentProps {
  columns: ColumnDef<TestProps>[];
  table: TableType<TestProps>;
  onDataChange: (data: TestProps[]) => void;
  onTotalCountChange: (count: number) => void;
}

export function TestsTableContent({
  columns,
  table,
  onDataChange,
  onTotalCountChange,
}: TestsTableContentProps) {
  const t = useTranslations("Pagination");
  const { userData } = useUser();
  const pagination = table.getState().pagination;
  const columnFilters = table.getState().columnFilters;
  const titleFilter =
    (columnFilters.find((filter) => filter.id === "title")?.value as string) ||
    "";
  const debouncedTitleFilter = useDebounce(titleFilter, 500);
  const levelFilter = columnFilters.find((filter) => filter.id === "level")
    ?.value as EnglishLevel[];

  const search = {
    searchTerm: debouncedTitleFilter || undefined,
    levels: levelFilter || undefined,
  };

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...testsQueries.list(
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
