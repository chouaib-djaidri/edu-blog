"use client";

import { ComponentProps, forwardRef, useEffect, useRef, useState } from "react";
import { Input } from "./input";

const InputAutoWidth = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ ...props }, ref) => {
    const [width, setWidth] = useState<number>(120);
    const measureRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      const element = measureRef.current;
      if (element) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setWidth(Math.max(120, entry.target.scrollWidth));
          }
        });
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
      }
    }, []);
    return (
      <div className="relative">
        <span
          ref={measureRef}
          className="invisible absolute whitespace-pre px-3 py-2"
          aria-hidden="true"
        >
          {props.value}
        </span>
        <Input
          style={{ width: `${width}px`, ...props.style }}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputAutoWidth.displayName = "InputAutoWidth";

export { InputAutoWidth };
