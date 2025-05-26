import UserForm from "@/components/forms/admin/user-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table } from "@tanstack/react-table";
import { CirclePlusIcon, PlusCircle, UserRoundPen } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { UserProps } from "../types";

const UserModal = ({
  table,
  isOpen,
  userToUpdate,
  setIsOpen,
  setUserToUpdate,
}: {
  table: Table<UserProps>;
  userToUpdate: UserProps | null;
  isOpen: boolean;
  setUserToUpdate: Dispatch<SetStateAction<UserProps | null>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("UsersManagement");
  const isUpdating = !!userToUpdate;
  return (
    <>
      <Button
        size="sm"
        className="max-lg:size-10 max-lg:p-0"
        onClick={() => {
          setIsOpen(true);
          setUserToUpdate(null);
        }}
      >
        <CirclePlusIcon className="size-4.5" />
        <span className="max-lg:hidden">{t("newUser.title")}</span>
      </Button>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {isUpdating ? (
                  <UserRoundPen strokeWidth={1.75} size={22} />
                ) : (
                  <PlusCircle strokeWidth={1.75} size={22} />
                )}

                {isUpdating ? t("updateUser.title") : t("newUser.title")}
              </DialogTitle>
              <DialogDescription>
                {isUpdating
                  ? t("updateUser.description")
                  : t("newUser.description")}
              </DialogDescription>
            </DialogHeader>
            <UserForm
              table={table}
              setIsOpen={setIsOpen}
              userToUpdate={userToUpdate}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UserModal;
