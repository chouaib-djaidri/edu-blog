import PressedButton from "@/components/buttons/pressed-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MatchMetadata,
  OrderedResponse,
  QuestionProps,
  ReorderOptsQuizProps,
  TitleIdProps,
} from "@/types/globals";
import { CircleArrowRight } from "lucide-react";
import { useState } from "react";

const MatchBlog = ({ metadata, question }: QuestionProps) => {
  const [selectedItems, setSelectedItems] = useState<ReorderOptsQuizProps>([]);
  const correct = metadata.correctAnswer as OrderedResponse;
  const showResult = selectedItems.length === correct.length;
  const handleItemSelect = (item: TitleIdProps) => {
    if (!selectedItems.some((el) => el.id === item.id)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
    }
  };

  const handleItemRemove = (itemId: string) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== itemId);
    setSelectedItems(newSelectedItems);
  };

  const isItemSelected = (id: string) => {
    return selectedItems.some((item) => item.id === id);
  };

  return (
    <div className="w-full h-full max-w-md mx-auto flex items-center justify-center flex-col gap-6">
      <h3 className="text-lg font-semibold first-letter:uppercase">
        {question}
      </h3>
      <div className="space-y-6 w-full">
        <div className="flex flex-col gap-1.5 w-full">
          {(metadata as MatchMetadata).data.l?.map(
            ({ id: itemId, title }, index) => {
              const selected = selectedItems?.[index];

              const isCorrect =
                showResult &&
                correct.find((el) => el.id === selected?.id)?.order === index;
              return (
                <div key={itemId} className="flex w-full gap-3">
                  <div className="flex-1 first-letter:uppercase">
                    <p className="w-fit min-h-12 rounded-2xl font-medium px-6 flex items-center border border-[#00527A] text-[#00527A] flex-1">
                      {title}
                    </p>
                  </div>
                  <div className="flex items-center shrink-0">
                    <CircleArrowRight
                      className="size-5 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex-1 flex justify-end">
                    <button
                      className={cn(
                        "min-h-12 px-6 rounded-2xl font-semibold flex items-center border border-primary/30 bg-primary/5 min-w-20 first-letter:uppercase",
                        selected &&
                          "bg-primary text-white w-fit min-w-fit cursor-pointer",
                        showResult &&
                          isCorrect &&
                          "bg-green-700 border-green-700 pointer-events-none",
                        showResult &&
                          !isCorrect &&
                          "bg-red-700 border-red-700 pointer-events-none"
                      )}
                      type="button"
                      onClick={() => {
                        if (!selected || showResult) return;
                        handleItemRemove(selected.id);
                      }}
                    >
                      {selected?.title}
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="flex flex-wrap mx-auto gap-1.5 w-fit">
          {(metadata as MatchMetadata).data.r?.map(({ id: itemId, title }) => (
            <PressedButton
              key={itemId}
              className={cn(
                "px-6",
                isItemSelected(itemId) &&
                  "text-transparent hover:bg-background group-active:-top-1 group-active:bg-background pointer-events-none selection:text-transparent group-active:border-b-1"
              )}
              variant={isItemSelected(itemId) ? "outline" : "default"}
              parentClassName={cn(
                "w-fit",
                isItemSelected(itemId) && "pointer-events-none"
              )}
              rounded="2xl"
              onClick={() => handleItemSelect({ id: itemId, title })}
            >
              {title}
            </PressedButton>
          ))}
        </div>
      </div>
      {showResult && (
        <Button
          variant="link"
          type="button"
          className="mx-auto text-muted-foreground hover:no-underline"
          onClick={() => {
            setSelectedItems([]);
          }}
        >
          Reset Answer
        </Button>
      )}
    </div>
  );
};

export default MatchBlog;
