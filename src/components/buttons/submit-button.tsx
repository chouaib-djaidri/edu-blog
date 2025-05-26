import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import { Button, ButtonProps } from "../ui/button";

const SubmitButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { isPending?: boolean }
>(
  (
    { isPending, className, disabled, type = "submit", children, ...props },
    ref
  ) => {
    const tb = useTranslations("Buttons");
    return (
      <Button
        className={cn("w-full", className)}
        disabled={isPending || disabled}
        type={type}
        ref={ref}
        {...props}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="size-4.5 animate-spin" strokeWidth={2} />
            {tb("wait")}
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);

SubmitButton.displayName = "SubmitButton";

export default SubmitButton;
