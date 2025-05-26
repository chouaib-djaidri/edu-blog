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
import { BlogsTableContent } from "./content";
import DeleteBlogModal from "./modals/delete-blog-modal";
import Toolbar from "./toolbar";
import { BlogProps } from "./types";
import { useTranslations } from "next-intl";
import { useUser } from "@/context/user";
import BlogPreviewModal from "./modals/blog-preview-modal";

export function BlogsTable() {
  const t = useTranslations("Toolbar");
  const { userData } = useUser();
  const [data, setData] = useState<BlogProps[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [blogToDelete, setBlogToDelete] = useState<Pick<
    BlogProps,
    "id" | "title"
  > | null>(null);

  const handleDeleteBlog = (blogData: Pick<BlogProps, "id" | "title">) => {
    setBlogToDelete(blogData);
  };

  const [blogToPreview, setBlogToPreview] = useState<BlogProps | null>(null);
  const handleBlogPreview = (blog: BlogProps) => {
    setBlogToPreview(blog);
  };

  const columns = useMemo(
    () => columnsData(handleDeleteBlog, handleBlogPreview, userData?.role),
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
          <BlogsTableContent
            columns={columns}
            table={table}
            onDataChange={setData}
            onTotalCountChange={setTotalCount}
          />
        </Table>
      </div>
      <Pagination table={table} />
      {blogToPreview && (
        <BlogPreviewModal
          blogToPreview={blogToPreview}
          setBlogToPreview={setBlogToPreview}
        />
      )}
      {!!blogToDelete && (
        <DeleteBlogModal
          blogToDelete={blogToDelete}
          handleClose={() => {
            setBlogToDelete(null);
          }}
        />
      )}
    </div>
  );
}
