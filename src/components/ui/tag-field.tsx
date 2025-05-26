"use client";
import { Badge } from "@/components/ui/badge";
import { cn, getLetterBadgeClasses } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { z } from "zod";

// Simplified helper to parse tags using an optional validator
const parseTag = (tag: string, tagValidator?: z.ZodString) => {
  if (!tagValidator) return tag.trim();
  const parsed = tagValidator.safeParse(tag.trim());
  return parsed.success ? parsed.data : null;
};

type TagFieldProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> & {
  value?: string[];
  onChange: (value: string[]) => void;
  tagValidator?: z.ZodString;
  maxTags?: number;
  placeholder?: string;
  customColorFn?: (tag: string) => string;
  disabled?: boolean;
};

export function TagField({
  className,
  value = [],
  onChange,
  tagValidator,
  placeholder = "Add tag...",
  maxTags,
  customColorFn,
  disabled = false,
  ...domProps
}: TagFieldProps) {
  const [pendingTag, setPendingTag] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingTag.includes(",")) {
      const rawTags = pendingTag.split(",");
      const newTags = new Set([...value]);
      rawTags.forEach((tag) => {
        const parsedTag = parseTag(tag, tagValidator);
        if (parsedTag && !newTags.has(parsedTag)) {
          newTags.add(parsedTag);
        }
      });
      onChange(Array.from(newTags));
      setPendingTag("");
    }
  }, [pendingTag, onChange, value, tagValidator]);

  const addTag = () => {
    if (
      !pendingTag.trim() ||
      (maxTags !== undefined && value.length >= maxTags)
    )
      return;
    const parsedTag = parseTag(pendingTag, tagValidator);
    if (parsedTag && !value.includes(parsedTag)) {
      const newTags = [...value, parsedTag];
      onChange(newTags);
      setPendingTag("");
      setActiveIndex(-1);
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = value.filter((_, i) => i !== indexToRemove);
    onChange(newTags);
    setActiveIndex(-1);
    // Focus input after removing tag
    inputRef.current?.focus();
  };

  const getTagColor = (tag: string) => {
    // Use custom color function if provided, otherwise use letter-based coloring
    return customColorFn ? customColorFn(tag) : getLetterBadgeClasses(tag);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (
      e.key === "Backspace" &&
      pendingTag.length === 0 &&
      value.length > 0
    ) {
      e.preventDefault();
      removeTag(value.length - 1);
    } else if (
      e.key === "ArrowLeft" &&
      pendingTag.length === 0 &&
      activeIndex === -1
    ) {
      setActiveIndex(value.length - 1);
    } else if (activeIndex !== -1) {
      if (e.key === "ArrowRight") {
        if (activeIndex < value.length - 1) {
          setActiveIndex(activeIndex + 1);
        } else {
          setActiveIndex(-1);
          inputRef.current?.focus();
        }
      } else if (e.key === "ArrowLeft") {
        if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        removeTag(activeIndex);
      } else if (e.key === "Escape") {
        setActiveIndex(-1);
        inputRef.current?.focus();
      }
    }
  };

  // Handle clicks outside to reset active tag
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if the input has aria-invalid attribute
  const isInvalid = domProps["aria-invalid"] === true;

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex min-h-11 w-full flex-wrap gap-2 rounded-xl border border-input bg-background px-2 py-2 text-sm focus-within:ring-1 focus-within:border-ring focus-within:ring-ring",
        isInvalid &&
          "border-destructive ring-destructive focus-within:border-destructive focus-within:ring-destructive",
        className
      )}
      onClick={(e) => {
        // Focus input when clicking on the container
        if (e.target === containerRef.current) {
          inputRef.current?.focus();
        }
      }}
    >
      {value.map((tag, index) => (
        <Badge
          key={index}
          variant="outline"
          className={cn(
            "h-6.5 flex items-center px-2 text-xs font-medium capitalize",
            getTagColor(tag),
            activeIndex === index && "ring-0 ring-ring ring-offset-0"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex(index === activeIndex ? -1 : index);
          }}
        >
          <span className="pt-0.5"> {tag}</span>
          {!disabled && (
            <button
              type="button"
              className="p-0 cursor-pointer opacity-80 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
            >
              <XIcon className="size-3.5" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          )}
        </Badge>
      ))}
      <input
        ref={inputRef}
        className={cn(
          "flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed h-6.5 border border-transparent px-1",
          isInvalid && "placeholder:text-destructive/70 text-destructive"
        )}
        value={pendingTag}
        onChange={(e) => setPendingTag(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (pendingTag) addTag();
          setActiveIndex(-1);
        }}
        placeholder={placeholder}
        disabled={
          disabled || (maxTags !== undefined && value.length >= maxTags)
        }
        {...domProps}
      />
    </div>
  );
}
