import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BlogProps } from "../types";

// Mock function to simulate deleting a blog
const deleteBlog = async (id: string): Promise<{ success: boolean }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { success: true };
};

const DeleteBlogModal = ({
  blogToDelete,
  handleClose,
}: {
  blogToDelete: Pick<BlogProps, "id" | "title">;
  handleClose: () => void;
}) => {
  const t = useTranslations("BlogsManagement");
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const { success } = await deleteBlog(blogToDelete.id);
      if (success) {
        toast.success(t("deleteBlog.successTitle"), {
          description: t("deleteBlog.successDescription"),
        });
        handleClose();
      } else {
        throw new Error("Failed to delete blog");
      }
    } catch (error) {
      toast.error(t("deleteBlog.errorTitle"), {
        description: t("deleteBlog.errorDescription"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2Icon strokeWidth={1.75} size={22} className="text-red-600" />
            {t("deleteBlog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteBlog.description", { title: blogToDelete.title })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("deleteBlog.cancel")}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading}
            >
              {isLoading ? t("deleteBlog.deleting") : t("deleteBlog.confirm")}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteBlogModal;
