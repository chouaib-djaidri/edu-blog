import { cn } from "@/lib/utils";
import { SlotProps } from "input-otp";

export function OtpInputSlot(props: SlotProps & { invalid?: boolean }) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground flex size-12 items-center justify-center rounded-md border font-medium shadow-xs transition-[color,box-shadow]",
        {
          "outline-none ring-1 border-ring ring-ring ring-offset-0":
            props.isActive,
          "ring-destructive border-destructive text-destructive": props.invalid,
        }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
