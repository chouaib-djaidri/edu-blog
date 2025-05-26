import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getBunnyUrl, getPreview } from "@/lib/paths";
import {
  cn,
  getLetterBadgeClasses,
  getBlogStatusBadgeClasses,
} from "@/lib/utils";
import { Role } from "@/types/globals";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { BlogProps, BlogStatus } from "./types";
import Link from "next/link";

export const columns = (
  handleDeleteBlog: (blogData: Pick<BlogProps, "id" | "title">) => void,
  handleViewBlog: (blogData: BlogProps) => void,
  role: Role = Role.CREATOR
): ColumnDef<BlogProps>[] => {
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
          } as ColumnDef<BlogProps>,
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
                  src="https://images.unsplash.com/photo-1657639028182-24e11504c7c1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  className="absolute w-full h-full object-cover"
                />
              </div>
            ),
          } as ColumnDef<BlogProps>,
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
      accessorKey: "excerpt",
      header: "excerpt",
      cell: ({ row }) => (
        <div className="line-clamp-2">{row.getValue("excerpt")}</div>
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
      accessorKey: "status",
      header: "status",
      cell: ({ row }) => {
        const status = row.getValue("status") as BlogStatus;
        return (
          <Badge className={getBlogStatusBadgeClasses(status)}>
            {status === "published" ? "Published" : "Draft"}
          </Badge>
        );
      },
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
      accessorKey: "publishedAt",
      header: "publishedAt",
      cell: ({ row }) => {
        const publishedAt = row.getValue("publishedAt");
        return (
          <div className="truncate">
            {publishedAt
              ? format(publishedAt as string, "MMMM dd, yyyy 'at' HH:mm")
              : "Not published yet"}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-1 justify-end">
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() => handleViewBlog(row.original)}
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
              <Link href={`/blogs-management/edit/${row.original.slug}`}>
                <EditIcon className="size-4" />
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            className="size-8 cursor-pointer"
            onClick={() =>
              handleDeleteBlog({
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
