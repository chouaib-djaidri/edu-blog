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
import { deleteUser } from "@/lib/supabase/tables/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usersQueries } from "../queries";
import { UserProps } from "../types";
import { useTranslations } from "next-intl";

const DeleteUserModal = ({
  userToDelete: { fullName, id },
  handleClose,
}: {
  userToDelete: Pick<UserProps, "fullName" | "id">;
  handleClose: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const tf = useTranslations("Fields");
  const t = useTranslations("UsersManagement");
  const to = useTranslations("Toasts");
  const tb = useTranslations("Buttons");
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: (testId: string) => deleteUser(testId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersQueries.all,
      });
      toast.custom((id) => (
        <SuccessSonner
          id={id}
          title={to("users.deleteSuccess", { count: 1 })}
        />
      ));
      handleClose();
    },
    onError: () => {
      toast.custom((id) => (
        <WrongSonner id={id} title={to("users.deleteFailed", { count: 1 })} />
      ));
    },
  });

  const handleDelete = () => {
    deleteUserMutation.mutate(id);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(o) => {
        if (!o && !deleteUserMutation.isPending) {
          handleClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 strokeWidth={1.75} size={22} />
            {t("deleteUser.title")}
          </DialogTitle>
          <DialogDescription>
            {t("deleteUser.description", { fullName })}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="space-y-1 w-full">
            <p className="capitalize font-semibold text-base">
              {t("deleteUser.description", { fullName })}
            </p>
            <p className="text-start">
              {t.rich("deleteUser.warningMessage", {
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
              disabled={deleteUserMutation.isPending}
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
              disabled={deleteUserMutation.isPending}
            >
              {tb("cancel")}
            </Button>
          </DialogClose>
          <SubmitButton
            type="button"
            isPending={deleteUserMutation.isPending}
            className="flex-1"
            variant="destructive"
            disabled={inputValue !== "delete" || deleteUserMutation.isPending}
            onClick={handleDelete}
          >
            {tb("delete")}
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;
