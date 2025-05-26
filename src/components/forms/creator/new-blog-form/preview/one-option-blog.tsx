import PressedButton from "@/components/buttons/pressed-button";
import { Button } from "@/components/ui/button";
import { ExtraTextBlank } from "@/components/ui/text-blank";
import { cn } from "@/lib/utils";
import {
  OneOptionMetadata,
  OneSelectionResponse,
  QuestionProps,
} from "@/types/globals";
import { useState } from "react";

const OneOptionBlog = ({ metadata, question }: QuestionProps) => {
  const [answer, setAnswer] = useState("");
  const correct = (metadata.correctAnswer as OneSelectionResponse)?.id;
  return (
    <div className="w-full h-full max-w-md mx-auto flex items-center justify-center flex-col gap-6">
      <h3 className="text-lg font-semibold first-letter:capitalize">
        <ExtraTextBlank text={question} />
      </h3>
      <div className="grid gap-y-1.5 max-w-sm min-w-52">
        {(metadata as OneOptionMetadata).data.map(({ id: itemId, title }) => {
          const isCorrect = correct === itemId;
          return (
            <PressedButton
              key={itemId}
              className={cn("whitespace-normal px-12 overflow-hidden")}
              variant={
                answer && isCorrect
                  ? "success"
                  : answer === itemId && !isCorrect
                    ? "destructive"
                    : "default"
              }
              rounded="2xl"
              freez={!!answer}
              onClick={() => {
                setAnswer(itemId);
              }}
            >
              {title}
            </PressedButton>
          );
        })}
      </div>
      {!!answer && (
        <Button
          variant="link"
          type="button"
          className="mx-auto text-muted-foreground hover:no-underline"
          onClick={() => {
            setAnswer("");
          }}
        >
          Reset Answer
        </Button>
      )}
    </div>
  );
};

export default OneOptionBlog;
