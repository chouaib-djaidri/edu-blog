import SubmitButton from "@/components/buttons/submit-button";
import SuccessSonner from "@/components/sonners/success-sonner";
import WrongSonner from "@/components/sonners/wrong-sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMultipleTests } from "@/lib/supabase/tables/tests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { testsQueries } from "../queries";
import { TestProps } from "../types";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

const DeleteTestsModal = ({ table }: { table: Table<TestProps> }) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const t = useTranslations("TestsManagement");
  const tf = useTranslations("Fields");
  const to = useTranslations("Toasts");
  const tb = useTranslations("Buttons");

  const selectedRows = table.getSelectedRowModel().rows;
  const count = selectedRows.length;

  const bulkDeleteMutation = useMutation({
    mutationFn: async (selectedUserIds: string[]) => {
      return await deleteMultipleTests(selectedUserIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: testsQueries.all,
      });
      toast.custom((id) => (
        <SuccessSonner id={id} title={to("tests.deleteSuccess", { count })} />
      ));
      table.resetRowSelection();
      setIsOpen(false);
    },
    onError: () => {
      toast.custom((id) => (
        <WrongSonner id={id} title={to("tests.deleteFailed", { count })} />
      ));
    },
  });

  const handleDelete = () => {
    const userIds = selectedRows.map((row) => row.original.id);
    bulkDeleteMutation.mutate(userIds);
  };

  if (count === 0) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!bulkDeleteMutation.isPending) {
          setIsOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2Icon className="-ms-1 size-4.5" aria-hidden="true" />
          {tb("delete")}
          {` (${count})`}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 strokeWidth={1.75} size={22} />
            {t("deleteTests.title")}
          </DialogTitle>
          <DialogDescription>
            {t("deleteTests.description", { count })}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="space-y-1 w-full">
            <p className="capitalize font-semibold text-base">
              {t("deleteTests.description", { count })}
            </p>
            <p className="text-start">
              {t.rich("deleteTests.warningMessage", {
                count,
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
          <div className="space-y-1.5 w-full">
            <Label htmlFor="delete-tests" className="sr-only">
              {tf("deleteConfirm.label")}
            </Label>
            <Input
              id="delete-tests"
              type="text"
              placeholder={tf("deleteConfirm.placeholder")}
              className="rounded-xl"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={bulkDeleteMutation.isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="flex-1"
              disabled={bulkDeleteMutation.isPending}
            >
              {tb("cancel")}
            </Button>
          </DialogClose>
          <SubmitButton
            type="button"
            isPending={bulkDeleteMutation.isPending}
            className="flex-1"
            variant="destructive"
            disabled={inputValue !== "delete" || bulkDeleteMutation.isPending}
            onClick={handleDelete}
          >
            {tb("delete")}
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTestsModal;
