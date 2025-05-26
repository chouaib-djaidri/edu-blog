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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteTest } from "@/lib/supabase/tables/tests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { testsQueries } from "../queries";
import { TestProps } from "../types";
import { useTranslations } from "next-intl";

const DeleteTestModal = ({
  testToDelete: { title, id },
  handleClose,
}: {
  testToDelete: Pick<TestProps, "title" | "id">;
  handleClose: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const tf = useTranslations("Fields");
  const t = useTranslations("TestsManagement");
  const to = useTranslations("Toasts");
  const tb = useTranslations("Buttons");
  const queryClient = useQueryClient();

  const deleteTestMutation = useMutation({
    mutationFn: (testId: string) => deleteTest(testId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: testsQueries.all,
      });
      toast.custom((id) => (
        <SuccessSonner
          id={id}
          title={to("tests.deleteSuccess", { count: 1 })}
        />
      ));
      handleClose();
    },
    onError: () => {
      toast.custom((id) => (
        <WrongSonner id={id} title={to("tests.deleteFailed", { count: 1 })} />
      ));
    },
  });

  const handleDelete = () => {
    deleteTestMutation.mutate(id);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(o) => {
        if (!o && !deleteTestMutation.isPending) {
          handleClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 strokeWidth={1.75} size={22} />
            {t("deleteTest.title")}
          </DialogTitle>
          <DialogDescription>
            {t("deleteTest.description", { title })}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="space-y-1 w-full">
            <p className="capitalize font-semibold text-base">
              {t("deleteTest.description", { title })}
            </p>
            <p className="text-start">
              {t.rich("deleteTest.warningMessage", {
                b: (chunk) => <b>{chunk}</b>,
              })}
            </p>
          </div>
          <div className="space-y-1.5 w-full">
            <Label htmlFor="delete-project" className="sr-only">
              {tf("deleteConfirm.label")}
            </Label>
            <Input
              id="delete-project"
              type="text"
              placeholder={tf("deleteConfirm.placeholder")}
              className="rounded-xl"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={deleteTestMutation.isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1"
              disabled={deleteTestMutation.isPending}
            >
              {tb("cancel")}
            </Button>
          </DialogClose>
          <SubmitButton
            type="button"
            isPending={deleteTestMutation.isPending}
            className="flex-1"
            variant="destructive"
            disabled={inputValue !== "delete" || deleteTestMutation.isPending}
            onClick={handleDelete}
          >
            {tb("delete")}
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTestModal;
