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
import { UsersTableContent } from "./content";
import DeleteUserModal from "./modals/delete-user-modal";
import Toolbar from "./toolbar";
import { UserProps } from "./types";
import { useTranslations } from "next-intl";

export function UsersTable() {
  const t = useTranslations("Toolbar");
  const [data, setData] = useState<UserProps[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [userToDelete, setUserToDelete] = useState<Pick<
    UserProps,
    "id" | "fullName"
  > | null>(null);
  const [userToUpdate, setUserToUpdate] = useState<UserProps | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const handleEditUser = (user: UserProps) => {
    setUserToUpdate(user);
    setIsUserModalOpen(true);
  };
  const columns = useMemo(
    () => columnsData(setUserToDelete, handleEditUser),
    []
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
      <Toolbar
        table={table}
        userToUpdate={userToUpdate}
        setUserToUpdate={setUserToUpdate}
        isUserModalOpen={isUserModalOpen}
        setIsUserModalOpen={setIsUserModalOpen}
      />
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
          <UsersTableContent
            columns={columns}
            table={table}
            onDataChange={setData}
            onTotalCountChange={setTotalCount}
          />
        </Table>
      </div>
      <Pagination table={table} />
      {!!userToDelete && (
        <DeleteUserModal
          userToDelete={userToDelete}
          handleClose={() => {
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
}
