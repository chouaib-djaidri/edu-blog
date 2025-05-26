import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-11 w-full min-w-0 rounded-xl border bg-transparent px-3 py-1 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
        "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-1",
        "aria-invalid:ring-destructive aria-invalid:border-destructive aria-invalid:placeholder:text-destructive/70 aria-invalid:text-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
