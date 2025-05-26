import { CircleCheckIcon, XIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const SuccessSonner = ({
  id,
  title,
}: {
  id?: string | number;
  title: string;
}) => {
  return (
    <div className="group bg-green-600 text-white w-full rounded-md p-4 shadow-lg sm:w-[var(--width)]">
      <div className="flex items-center gap-2">
        <div className="flex grow gap-2 pb-0.5">
          <CircleCheckIcon
            className="mt-0.5 shrink-0 size-5"
            aria-hidden="true"
            strokeWidth={2.25}
          />
          <p className="text-base font-medium capitalize">{title}</p>
        </div>
        {id && (
          <Button
            variant="ghost"
            className="opacity-0 group-hover:opacity-80 hover:!opacity-100 transition-opacity size-4 shrink-0 p-0 hover:bg-transparent hover:text-white"
            onClick={() => toast.dismiss(id)}
            aria-label="Close banner"
          >
            <XIcon
              className="transition-opacity size-4"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuccessSonner;
