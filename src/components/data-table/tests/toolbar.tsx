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
import { cn, getLevelBadgeClasses } from "@/lib/utils";
import { EnglishLevel, Role } from "@/types/globals";
import {
  CirclePlusIcon,
  CircleXIcon,
  Columns3Icon,
  SearchIcon,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef } from "react";
import { TableProps } from "../pagination";
import { TestProps } from "./types";
import { useUser } from "@/context/user";
import DeleteTestsModal from "./modals/delete-tests-modal";

const Toolbar = ({ table }: TableProps<TestProps>) => {
  const ts = useTranslations("TestsManagement");
  const t = useTranslations("Toolbar");
  const inputRef = useRef<HTMLInputElement>(null);

  const { userData } = useUser();

  const levelFilters =
    (table.getColumn("level")?.getFilterValue() as string[]) || [];

  const toggleLevel = (level: string) => {
    const levelColumn = table.getColumn("level");
    if (!levelColumn) return;
    const currentFilters = (levelColumn.getFilterValue() as string[]) || [];
    const isSelected = currentFilters.includes(level);
    let newFilters: string[];
    if (isSelected) {
      newFilters = currentFilters.filter((l) => l !== level);
    } else {
      newFilters = [...currentFilters, level];
    }
    if (newFilters.length > 0) {
      levelColumn.setFilterValue(newFilters);
    } else {
      levelColumn.setFilterValue(undefined);
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="max-lg:size-10 max-lg:p-0"
            >
              <Star className="lg:-ms-1 size-4.5" aria-hidden="true" />
              <span className="max-lg:hidden">{t("level.label")}</span>
              {levelFilters.length > 0 && (
                <span className="bg-primary text-primary-foreground -me-1 ms-1 inline-flex h-5 max-h-full items-center rounded px-1.5 text-[0.625rem] font-medium max-lg:hidden">
                  {levelFilters.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto min-w-36 max-lg:max-w-46 p-4"
            align="start"
          >
            <div className="space-y-2.5">
              <div className="font-medium">{t("level.placeholder")}</div>
              <div className="flex flex-wrap gap-1">
                {Object.keys(EnglishLevel).map((value) => (
                  <div key={value} className="flex items-center gap-2">
                    <Label className="flex grow justify-between gap-2 font-normal">
                      <Checkbox
                        checked={levelFilters.includes(value)}
                        onCheckedChange={() => toggleLevel(value)}
                        className="sr-only"
                      />
                      <Badge
                        className={cn(
                          "cursor-pointer leading-[18px]",
                          getLevelBadgeClasses(value),
                          levelFilters.includes(value)
                            ? "opacity-100"
                            : "opacity-50"
                        )}
                      >
                        {value} {t("level.label")}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
        <DeleteTestsModal table={table} />
        {userData?.role === Role.CREATOR && (
          <Button size="sm" className="max-lg:size-10 max-lg:p-0" asChild>
            <Link href="/add-new-test">
              <CirclePlusIcon className="size-4.5" />
              <span className="max-lg:hidden">{ts("newTest.title")}</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
