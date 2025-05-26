import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getBunnyUrl, getPreview } from "@/lib/paths";
import { cn, getLetterBadgeClasses, getLevelBadgeClasses } from "@/lib/utils";
import { Role } from "@/types/globals";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { TestProps } from "./types";
import Link from "next/link";

export const columns = (
  handleDeleteTest: (testData: Pick<TestProps, "id" | "title">) => void,
  handleViewTest: (testData: TestProps) => void,
  role: Role = Role.CREATOR
): ColumnDef<TestProps>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 28,
    },
    ...(role === Role.ADMIN
      ? [
          {
            accessorKey: "author",
            header: "author",
            cell: ({ row }) => {
              console.log(row.original);
              const avatar = getPreview(
                row.original.authorAvatarUrl,
                "avatars"
              );
              const fullName =
                (row.original.authorFullName as string) || "Unknown Author";
              return (
                <div className="flex items-center gap-2">
                  <Avatar className="rounded-xl">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="rounded-xl">
                      {fullName.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="truncate capitalize" title={fullName}>
                    {fullName}
                  </div>
                </div>
              );
            },
          } as ColumnDef<TestProps>,
        ]
      : [
          {
            accessorKey: "coverUrl",
            header: "coverUrl",
            cell: ({ row }) => (
              <div className="w-full min-w-20 max-w-24 aspect-[3/2] relative rounded-xl overflow-hidden">
                <Image
                  width={300}
                  height={200}
                  alt=""
                  src={getBunnyUrl(`test-covers/${row.getValue("coverUrl")}`)}
                  className="absolute w-full h-full object-cover"
                />
              </div>
            ),
          } as ColumnDef<TestProps>,
        ]),
    {
      accessorKey: "title",
      header: "title",
      cell: ({ row }) => (
        <div className="line-clamp-2">{row.getValue("title")}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: "description",
      cell: ({ row }) => (
        <div className="line-clamp-2">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "categories",
      header: "categories",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.getValue("categories") as string[]).map((c) => (
            <Badge
              key={c}
              className={cn("capitalize", getLetterBadgeClasses(c))}
            >
              {c}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "level",
      header: "level",
      cell: ({ row }) => (
        <Badge className={getLevelBadgeClasses(row.getValue("level"))}>
          {row.getValue("level")} Level
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "createdAt",
      cell: ({ row }) => (
        <div className="truncate">
          {format(row.getValue("createdAt"), "MMMM dd, yyyy 'at' HH:mm")}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "updatedAt",
      cell: ({ row }) => (
        <div className="truncate">
          {format(row.getValue("updatedAt"), "MMMM dd, yyyy 'at' HH:mm")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() => handleViewTest(row.original)}
          >
            <EyeIcon className="size-4" />
          </Button>
          {role === Role.CREATOR && (
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-pointer"
              asChild
            >
              <Link href={`/tests-management/edit/${row.original.slug}`}>
                <EditIcon className="size-4" />
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() =>
              handleDeleteTest({
                id: row.original.id,
                title: row.original.title,
              })
            }
          >
            <Trash2Icon className="size-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];
};
