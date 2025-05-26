import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getLetterBadgeClasses, getBlogStatusBadgeClasses } from "@/lib/utils";
import { Role } from "@/types/globals";
import {
  CirclePlusIcon,
  CircleXIcon,
  Columns3Icon,
  SearchIcon,
  TagIcon,
  LayersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef } from "react";
import { TableProps } from "../pagination";
import { BlogCategory, BlogProps, BlogStatus } from "./types";
import { useUser } from "@/context/user";
import DeleteBlogsModal from "./modals/delete-blogs-modal";

const Toolbar = ({ table }: TableProps<BlogProps>) => {
  const ts = useTranslations("BlogsManagement");
  const t = useTranslations("Toolbar");
  const inputRef = useRef<HTMLInputElement>(null);

  const { userData } = useUser();

  const statusFilters =
    (table.getColumn("status")?.getFilterValue() as BlogStatus[]) || [];

  const toggleStatus = (status: BlogStatus) => {
    const statusColumn = table.getColumn("status");
    if (!statusColumn) return;
    const currentFilters = (statusColumn.getFilterValue() as BlogStatus[]) || [];
    const isSelected = currentFilters.includes(status);
    let newFilters: BlogStatus[];
    if (isSelected) {
      newFilters = currentFilters.filter((s) => s !== status);
    } else {
      newFilters = [...currentFilters, status];
    }
    if (newFilters.length > 0) {
      statusColumn.setFilterValue(newFilters);
    } else {
      statusColumn.setFilterValue(undefined);
    }
    table.setPageIndex(0);
  };

  const categoryFilters =
    (table.getColumn("categories")?.getFilterValue() as BlogCategory[]) || [];

  const toggleCategory = (category: BlogCategory) => {
    const categoryColumn = table.getColumn("categories");
    if (!categoryColumn) return;
    const currentFilters = (categoryColumn.getFilterValue() as BlogCategory[]) || [];
    const isSelected = currentFilters.includes(category);
    let newFilters: BlogCategory[];
    if (isSelected) {
      newFilters = currentFilters.filter((c) => c !== category);
    } else {
      newFilters = [...currentFilters, category];
    }
    if (newFilters.length > 0) {
      categoryColumn.setFilterValue(newFilters);
    } else {
      categoryColumn.setFilterValue(undefined);
    }
    table.setPageIndex(0);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-1.5">
      <div className="flex items-center gap-1.5 flex-wrap grow">
        <div className="relative">
          <Input
            ref={inputRef}
            className={cn(
              "peer w-36 lg:w-52 xl:w-full h-10 ps-9",
              Boolean(table.getColumn("title")?.getFilterValue()) && "pe-9"
            )}
            value={(table.getColumn("title")?.getFilterValue() ?? "") as string}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            placeholder={t("search.title.placeholder")}
            type="text"
            aria-label={t("search.title.label")}
          />
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <SearchIcon className="size-4.5" aria-hidden="true" />
          </div>
          {Boolean(table.getColumn("title")?.getFilterValue()) && (
            <button
              className="text-muted-foreground hover:text-foreground focus-visible:border-ring focus-visible:ring-ring absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t("clearFilter")}
              onClick={() => {
                table.getColumn("title")?.setFilterValue("");
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            >
              <CircleXIcon
                className="size-4.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
        
        {/* Status filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="max-lg:size-10 max-lg:p-0"
            >
              <LayersIcon className="lg:-ms-1 size-4.5" aria-hidden="true" />
              <span className="max-lg:hidden">{t("status.label")}</span>
              {statusFilters.length > 0 && (
                <span className="bg-primary text-primary-foreground -me-1 ms-1 inline-flex h-5 max-h-full items-center rounded px-1.5 text-[0.625rem] font-medium max-lg:hidden">
                  {statusFilters.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto min-w-36 max-lg:max-w-46 p-4"
            align="start"
          >
            <div className="space-y-2.5">
              <div className="font-medium">{t("status.placeholder")}</div>
              <div className="flex flex-wrap gap-1">
                {["published", "draft"].map((value) => (
                  <div key={value} className="flex items-center gap-2">
                    <Label className="flex grow justify-between gap-2 font-normal">
                      <Checkbox
                        checked={statusFilters.includes(value as BlogStatus)}
                        onCheckedChange={() => toggleStatus(value as BlogStatus)}
                        className="sr-only"
                      />
                      <Badge
                        className={cn(
                          "cursor-pointer leading-[18px]",
                          getBlogStatusBadgeClasses(value),
                          statusFilters.includes(value as BlogStatus)
                            ? "opacity-100"
                            : "opacity-50"
                        )}
                      >
                        {value === "published" ? "Published" : "Draft"}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Categories filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="max-lg:size-10 max-lg:p-0"
            >
              <TagIcon className="lg:-ms-1 size-4.5" aria-hidden="true" />
              <span className="max-lg:hidden">{t("categories.label")}</span>
              {categoryFilters.length > 0 && (
                <span className="bg-primary text-primary-foreground -me-1 ms-1 inline-flex h-5 max-h-full items-center rounded px-1.5 text-[0.625rem] font-medium max-lg:hidden">
                  {categoryFilters.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto min-w-36 max-lg:max-w-46 p-4"
            align="start"
          >
            <div className="space-y-2.5">
              <div className="font-medium">{t("categories.placeholder")}</div>
              <div className="flex flex-wrap gap-1">
                {Object.values(BlogCategory).map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Label className="flex grow justify-between gap-2 font-normal">
                      <Checkbox
                        checked={categoryFilters.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        className="sr-only"
                      />
                      <Badge
                        className={cn(
                          "cursor-pointer leading-[18px]",
                          getLetterBadgeClasses(category),
                          categoryFilters.includes(category)
                            ? "opacity-100"
                            : "opacity-50"
                        )}
                      >
                        {category}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="cursor-pointer max-lg:size-10 max-lg:p-0"
              variant="outline"
              size="sm"
            >
              <Columns3Icon className="size-4.5" />
              <span className="max-lg:hidden">{t("columns.label")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-fit">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {t(`columns.${column.columnDef.header as string}`)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-end gap-1.5 flex-wrap grow">
        <DeleteBlogsModal table={table} />
        {userData?.role === Role.CREATOR && (
          <Button size="sm" className="max-lg:size-10 max-lg:p-0" asChild>
            <Link href="/add-new-blog">
              <CirclePlusIcon className="size-4.5" />
              <span className="max-lg:hidden">{ts("newBlog.title")}</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
