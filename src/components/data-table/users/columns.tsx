import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getPreview } from "@/lib/paths";
import { cn, getLevelBadgeClasses, getRoleBadgeClasses } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EditIcon, Trash2Icon } from "lucide-react";
import { UserProps } from "./types";

export const columns = (
  handleDeleteUser: (userData: Pick<UserProps, "id" | "fullName">) => void,
  handleEditUser: (userData: UserProps) => void
): ColumnDef<UserProps>[] => [
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
  {
    accessorKey: "fullName",
    header: "fullName",
    cell: ({ row }) => {
      const avatar = getPreview(row.original.avatarUrl, "avatars");
      const fullName = row.getValue("fullName") as string;
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
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "email",
    cell: ({ row }) => <div className="truncate">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "role",
    cell: ({ row }) => (
      <Badge
        className={cn("capitalize", getRoleBadgeClasses(row.getValue("role")))}
      >
        {row.getValue("role")}
      </Badge>
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
          onClick={() => handleEditUser(row.original)}
        >
          <EditIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-8 cursor-pointer"
          onClick={() =>
            handleDeleteUser({
              id: row.original.id,
              fullName: row.original.fullName,
            })
          }
        >
          <Trash2Icon className="size-4 text-red-600" />
        </Button>
      </div>
    ),
  },
];
