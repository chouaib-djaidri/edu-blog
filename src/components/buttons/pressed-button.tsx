import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { useRef } from "react";
import { Button } from "../ui/button";

const colorSchemes = {
  default: "bg-primary hover:bg-primary group-active:!bg-[#3451a5]",
  success: "bg-green-600 hover:bg-green-600 group-active:!bg-green-700",
  destructive: "bg-red-600 hover:bg-red-600 group-active:!bg-red-700",
  secondary: "bg-purple-600 hover:bg-purple-600 group-active:!bg-purple-700",
  outline: "bg-background border-border hover:bg-accent text-foreground/80",
};

const activeStyles = {
  default: "bg-[#3451a5]",
  success: "bg-green-700",
  destructive: "bg-red-700",
  secondary: "bg-purple-800",
  outline: "bg-border",
};

const freezStyles = {
  default: "!bg-primary",
  success: "!bg-green-600 group-active:!bg-green-800",
  destructive: "!bg-red-600 group-active:!bg-red-800",
  secondary: "!bg-purple-600 group-active:!bg-purple-800",
  outline: "!bg-background",
};

const roundedStyles = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
};

const buttonVariants = cva(
  `relative transition-all duration-100 w-full px-8 h-fit min-h-11 -top-1 group-active:top-0 disabled:bg-[#E1E5EB] group-active:disabled:!bg-[#E1E5EB] disabled:text-[#b0b4bc] disabled:border-[#CCD3DD] disabled:group-active:-top-1 border-2 border-b-1 group-active:border-b-2 border-transparent`,
  {
    variants: {
      variant: {
        default: `${colorSchemes.default}`,
        success: `${colorSchemes.success}`,
        destructive: `${colorSchemes.destructive}`,
        secondary: `${colorSchemes.secondary}`,
        outline: `${colorSchemes.outline}`,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface PressedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isActive?: boolean;
  freez?: boolean;
  isPending?: boolean;
  rounded?: keyof typeof roundedStyles;
  parentClassName?: string;
}

const PressedButton = ({
  className,
  isActive,
  variant = "default",
  parentClassName,
  rounded = "xl",
  freez,
  type = "button",
  onClick,
  ...props
}: PressedButtonProps) => {
  const currentVariant = (variant || "default") as keyof typeof colorSchemes;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleWrapperClick = () => {
    if (props.disabled) return;
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "relative z-20 group w-full h-fit pt-1 transition-all",
        isActive || props.disabled || (freez && "pointer-events-none"),
        parentClassName
      )}
      onClick={handleWrapperClick}
    >
      <div
        className={cn(
          "absolute bottom-0 h-[calc(100%-0.25rem)] w-full transition-all",
          roundedStyles[rounded],
          activeStyles[currentVariant],
          props.disabled && "bg-[#D3D8E0]"
        )}
      />
      <Button
        ref={buttonRef}
        className={cn(
          buttonVariants({ variant, className }),
          "disabled:opacity-100 transition-all",
          roundedStyles[rounded],
          freez &&
            `${freezStyles[currentVariant]} group-active:-top-1 pointer-events-none group-active:border-b-1`,
          isActive &&
            `${activeStyles[currentVariant]} top-0 group-active:top-0 pointer-events-none cursor-default`
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        type={type}
        {...props}
      />
    </div>
  );
};

PressedButton.displayName = "PressedButton";
export default PressedButton;
