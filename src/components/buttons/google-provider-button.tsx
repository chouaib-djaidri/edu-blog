import { cn } from "@/lib/utils";
import Image from "next/image";
import { PressedButtonProps } from "./pressed-button";
import SubmitPressedButton from "./submit-pressed-button";

const GoogleProviderButton = ({ children, ...props }: PressedButtonProps) => {
  return (
    <SubmitPressedButton variant="outline" {...props}>
      <span className={cn(props.disabled && "opacity-70 transition-opacity")}>
        <Image
          src="/icons/google-icon.svg"
          alt="google icon"
          width={40}
          height={40}
          className="size-4"
        />
      </span>
      {children}
    </SubmitPressedButton>
  );
};

export default GoogleProviderButton;
