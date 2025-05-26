"use client";

import { useUserTestAnswer } from "@/context/user-test-answer";
import { getPreview } from "@/lib/paths";
import { cn } from "@/lib/utils";
import {
  OneImageMetadata,
  OneSelectionResponse,
  QuestionProps,
} from "@/types/globals";
import Image from "next/image";

const OneImageTest = ({ metadata, id, question }: QuestionProps) => {
  const { setUserTestAnswer, userTestAnswer } = useUserTestAnswer();
  const handleBtnClick = async (answer: string) => {
    setUserTestAnswer((prev) => ({ ...prev, [id]: { id: answer } }));
  };
  return (
    <div className="w-full h-full max-w-md mx-auto flex items-center justify-center flex-col gap-6">
      <h3 className="text-lg font-semibold">{question}</h3>
      <div className="grid grid-cols-2 gap-2 w-full relative max-w-72">
        {(metadata as OneImageMetadata).data.map(({ id: itemId, imageUrl }) => {
          const isSelected =
            (userTestAnswer?.[id] as OneSelectionResponse)?.id === itemId;
          const image = getPreview(imageUrl, "quiz-images");
          return (
            <button
              className={cn(
                "rounded-xl border-2 border-border/50 overflow-hidden ring-2 ring-transparent aspect-square transition-all cursor-pointer p-6",
                isSelected && "border-secondary ring-secondary"
              )}
              type="button"
              key={itemId}
              onClick={() => {
                handleBtnClick(itemId);
              }}
            >
              {image && (
                <Image
                  src={image}
                  alt={""}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OneImageTest;
