import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Table } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BlogProps } from "../types";

// Mock function to simulate deleting multiple blogs
const deleteBlogs = async (ids: string[]): Promise<{ success: boolean }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { success: true };
};

const DeleteBlogsModal = ({ table }: { table: Table<BlogProps> }) => {
  const t = useTranslations("BlogsManagement");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const ids = selectedRows.map((row) => row.original.id);
      const { success } = await deleteBlogs(ids);
      if (success) {
        toast.success(t("deleteBlogs.successTitle"), {
          description: t("deleteBlogs.successDescription", {
            count: selectedCount,
          }),
        });
        table.resetRowSelection();
        setOpen(false);
      } else {
        throw new Error("Failed to delete blogs");
      }
    } catch (error) {
      toast.error(t("deleteBlogs.errorTitle"), {
        description: t("deleteBlogs.errorDescription"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="max-lg:size-10 max-lg:p-0"
          disabled={selectedCount === 0}
        >
          <Trash2Icon className="size-4.5 text-red-600" />
          <span className="max-lg:hidden text-red-600">
            {t("deleteBlogs.button")}
          </span>
          {selectedCount > 0 && (
            <span className="bg-red-600 text-primary-foreground -me-1 ms-1 inline-flex h-5 max-h-full items-center rounded px-1.5 text-[0.625rem] font-medium max-lg:hidden">
              {selectedCount}
            </span>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2Icon strokeWidth={1.75} size={22} className="text-red-600" />
            {t("deleteBlogs.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteBlogs.description", { count: selectedCount })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("deleteBlogs.cancel")}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading}
            >
              {isLoading
                ? t("deleteBlogs.deleting")
                : t("deleteBlogs.confirm")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBlogsModal;
