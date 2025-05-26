import { cn } from "@/lib/utils";
import { Separator } from "./separator";

const TextBlank = ({ className }: { className?: string }) => {
  return (
    <div className="relative inline-flex items-center w-14 px-2">
      <Separator
        className={cn(
          "w-7 inline-flex data-[orientation=horizontal]:h-0.5 bg-foreground",
          className
        )}
        aria-label="blank text"
      />
      <span className="sr-only">___</span>
    </div>
  );
};

export const formatWithBlanks = (text: string, className?: string) => {
  const parts = text.split(/_{3,}/g);
  if (parts.length === 1) {
    return text;
  }
  const result = [];
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    if (i < parts.length - 1) {
      result.push(<TextBlank key={`blank-${i}`} className={className} />);
    }
  }
  return result;
};

const ExtraTextBlank = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return <>{formatWithBlanks(text, className)}</>;
};

export { TextBlank, ExtraTextBlank };
