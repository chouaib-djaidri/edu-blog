import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import PressedButton, { PressedButtonProps } from "./pressed-button";

const SubmitPressedButton = ({
  isPending,
  children,
  type = "submit",
  ...props
}: PressedButtonProps) => {
  const tb = useTranslations("Buttons");
  return (
    <PressedButton type={type} isActive={isPending} {...props}>
      {isPending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="size-5 animate-spin" /> {tb("wait")}
        </div>
      ) : (
        children
      )}
    </PressedButton>
  );
};

export default SubmitPressedButton;
