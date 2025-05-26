import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { TestProps } from "../types";
import TestPreview from "./test-preview";
import { UserTestAnswerProvider } from "@/context/user-test-answer";

const TestPreviewModal = ({
  testToPreview: { title, questions, level },
  setTestToPreview,
}: {
  testToPreview: TestProps;
  setTestToPreview: Dispatch<SetStateAction<TestProps | null>>;
}) => {
  const t = useTranslations("TestsManagement");
  return (
    <Dialog
      open={true}
      onOpenChange={(e) => {
        if (!e) setTestToPreview(null);
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EyeIcon strokeWidth={1.75} size={22} />
            {t("testPreview.title")}
          </DialogTitle>
          <DialogDescription>{t("testPreview.description")}</DialogDescription>
        </DialogHeader>
        <UserTestAnswerProvider>
          <TestPreview title={title} level={level} questions={questions} />
        </UserTestAnswerProvider>
      </DialogContent>
    </Dialog>
  );
};

export default TestPreviewModal;
