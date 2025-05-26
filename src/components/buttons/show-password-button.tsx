import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";

const ShowPasswordButton = ({
  onClick,
  className,
  show,
}: {
  onClick: () => void;
  className?: string;
  show: boolean;
}) => {
  return (
    <Button
      size="icon"
      className={cn(
        "size-6 hover:bg-transparent absolute end-2 focus-visible:ring-0 focus-visible:ring-offset-0 z-10 transition-colors text-foreground/60 hover:text-foreground",
        className
      )}
      variant="ghost"
      onClick={onClick}
      type="button"
    >
      {show ? (
        <EyeOff aria-hidden="true" className="size-4.5" strokeWidth={1.5} />
      ) : (
        <Eye aria-hidden="true" className="size-4.5" strokeWidth={1.5} />
      )}
    </Button>
  );
};

export default ShowPasswordButton;
