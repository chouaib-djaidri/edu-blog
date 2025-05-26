import { deleteAccount } from "@/actions/settings";
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
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const DeleteAccountModal = () => {
  const [inputValue, setInputValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const tf = useTranslations("Fields");
  const t = useTranslations("Settings");
  const to = useTranslations("Toasts");
  const tb = useTranslations("Buttons");

  const router = useRouter();

  const handleDelete = async () => {
    setIsPending(true);
    const state = await deleteAccount();
    if (state.msg) {
      toast.custom((id) => (
        <SuccessSonner id={id} title={to(state.msg as string)} />
      ));
      router.refresh();
      router.push("/login");
    }
    if (state.err) {
      toast.custom((id) => (
        <WrongSonner id={id} title={to(state.err as string)} />
      ));
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="hover:text-destructive disabled:opacity-60"
        >
          <span className="pt-px">{t("deleteAccount.title")}</span>
          <Trash2 className="size-4.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 strokeWidth={1.75} size={22} />
            {t("deleteAccount.title")}
          </DialogTitle>
          <DialogDescription>
            {t("deleteAccount.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="space-y-1 w-full">
            <p className="capitalize font-semibold text-base">
              {t("deleteAccount.description")}
            </p>
            <p className="text-start">
              {t.rich("deleteAccount.warningMessage", {
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
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
              variant="outline"
              className="flex-1"
              disabled={isPending}
            >
              {tb("cancel")}
            </Button>
          </DialogClose>
          <SubmitButton
            type="button"
            isPending={isPending}
            className="flex-1"
            variant="destructive"
            disabled={inputValue !== "delete"}
            onClick={handleDelete}
          >
            {tb("delete")}
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
