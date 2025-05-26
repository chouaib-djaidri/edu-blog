"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Table } from "@tanstack/react-table";

export type TableProps<T> = {
  table: Table<T>;
};

const Pagination = <T,>({ table }: TableProps<T>) => {
  const t = useTranslations("Pagination");

  return (
    <div className="flex max-sm:flex-col-reverse gap-2 items-center justify-between">
      <Label className="max-sm:ml-auto font-normal text-muted-foreground cursor-pointer shrink-0">
        {t("rowsPerPage")}
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger size="sm" className="w-20 cursor-pointer">
            <SelectValue
              placeholder={`${table.getState().pagination.pageSize}`}
            />
          </SelectTrigger>
          <SelectContent side="top" className="min-w-20">
            {[5, 10, 15, 20, 30].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>
      <div className="flex flex-1 max-sm:w-full items-center justify-end max-sm:justify-between gap-8">
        <div className="text-muted-foreground">
          {t("page", {
            current: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 flex rtl:rotate-180"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("firstPage")}</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8 rtl:rotate-180"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("previousPage")}</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8 rtl:rotate-180"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("nextPage")}</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8 flex rtl:rotate-180"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("lastPage")}</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
