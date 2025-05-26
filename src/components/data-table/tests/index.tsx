import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Pagination from "../pagination";
import { columns as columnsData } from "./columns";
import { TestsTableContent } from "./content";
import DeleteTestModal from "./modals/delete-test-modal";
import Toolbar from "./toolbar";
import { TestProps } from "./types";
import { useTranslations } from "next-intl";
import { useUser } from "@/context/user";
import TestPreviewModal from "./modals/test-preview-modal";

export function TestsTable() {
  const t = useTranslations("Toolbar");
  const { userData } = useUser();
  const [data, setData] = useState<TestProps[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [testToDelete, setTestToDelete] = useState<Pick<
    TestProps,
    "id" | "title"
  > | null>(null);
  const handleDeleteTest = (testTada: Pick<TestProps, "id" | "title">) => {
    setTestToDelete(testTada);
  };

  const [testToPreview, setTestToPreview] = useState<TestProps | null>(null);
  const handleTestPreview = (test: TestProps) => {
    setTestToPreview(test);
  };
  const columns = useMemo(
    () => columnsData(handleDeleteTest, handleTestPreview, userData?.role),
    [userData]
  );
  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="relative flex flex-col gap-4">
      <Toolbar table={table} />
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const hea = flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  );
                  const usingTrans = typeof hea === "string";
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : usingTrans
                          ? t(`columns.${header.id}`)
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TestsTableContent
            columns={columns}
            table={table}
            onDataChange={setData}
            onTotalCountChange={setTotalCount}
          />
        </Table>
      </div>
      <Pagination table={table} />
      {testToPreview && (
        <TestPreviewModal
          testToPreview={testToPreview}
          setTestToPreview={setTestToPreview}
        />
      )}
      {!!testToDelete && (
        <DeleteTestModal
          testToDelete={testToDelete}
          handleClose={() => {
            setTestToDelete(null);
          }}
        />
      )}
    </div>
  );
}
