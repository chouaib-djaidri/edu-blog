"use client";

import PressedButton from "@/components/buttons/pressed-button";
import { ExtraTextBlank } from "@/components/ui/text-blank";
import { useUserTestAnswer } from "@/context/user-test-answer";
import { cn } from "@/lib/utils";
import {
  OneOptionMetadata,
  OneSelectionResponse,
  QuestionProps,
} from "@/types/globals";

const OneOptionTest = ({ metadata, id, question }: QuestionProps) => {
  const { setUserTestAnswer, userTestAnswer } = useUserTestAnswer();
  const handleBtnClick = async (answer: string) => {
    setUserTestAnswer((prev) => ({ ...prev, [id]: { id: answer } }));
  };
  return (
    <div className="w-full h-full max-w-md mx-auto flex items-center justify-center flex-col gap-6">
      <h3 className="text-lg font-semibold">
        <ExtraTextBlank text={question} />
      </h3>
      <div className="grid gap-y-1.5 max-w-sm min-w-52">
        {(metadata as OneOptionMetadata).data.map(({ id: itemId, title }) => {
          const isSelected =
            (userTestAnswer?.[id] as OneSelectionResponse)?.id === itemId;
          return (
            <PressedButton
              key={itemId}
              className={cn("whitespace-normal px-12 overflow-hidden")}
              variant={isSelected ? "secondary" : "default"}
              rounded="2xl"
              freez={isSelected}
              onClick={() => {
                handleBtnClick(itemId);
              }}
            >
              {title}
            </PressedButton>
          );
        })}
      </div>
    </div>
  );
};

export default OneOptionTest;
