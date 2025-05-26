import PressedButton from "@/components/buttons/pressed-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  OrderedResponse,
  OrderMetadata,
  QuestionProps,
  ReorderOptsQuizProps,
  TitleIdProps,
} from "@/types/globals";
import { useEffect, useRef, useState } from "react";

const OrderWordsBlog = ({ metadata, question }: QuestionProps) => {
  const [selectedItems, setSelectedItems] = useState<ReorderOptsQuizProps>([]);
  const [orderSectionSizes, setOrderSectionSizes] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const correct = metadata.correctAnswer as OrderedResponse;
  const showResult = selectedItems.length === correct.length;

  const handleItemSelect = (item: TitleIdProps) => {
    if (!selectedItems.some((el) => el.id === item.id)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
    }
  };

  const handleItemRemove = (itemId: string) => {
    if (selectedItems.length === correct.length) return;
    const newSelectedItems = selectedItems.filter((item) => item.id !== itemId);
    setSelectedItems(newSelectedItems);
  };

  const isItemSelected = (id: string) => {
    return selectedItems.some((item) => item.id === id);
  };

  useEffect(() => {
    if (buttonRef.current) {
      const height = buttonRef.current.offsetHeight;
      const width = buttonRef.current.offsetWidth + 0.8;
      setOrderSectionSizes({ height, width });
    }
  }, []);

  return (
    <div className="w-full h-full mx-auto max-w-md flex items-center justify-center flex-col gap-6">
      <h3 className="text-lg font-semibold first-letter:uppercase">
        {question}
      </h3>
      <div className="space-y-6 w-full">
        <div className="pb-4 pt-4 border-t-2 border-b-2 w-full flex justify-center">
          <div
            className="flex flex-wrap gap-1.5"
            style={{
              minHeight: `${orderSectionSizes?.height}px`,
              minWidth: `${(orderSectionSizes?.width || 0) + 2}px`,
            }}
          >
            {selectedItems.map(({ id: itemId, title }, index) => {
              const isCorrect =
                showResult &&
                correct.find((el) => el.id === itemId)?.order === index;
              return (
                <PressedButton
                  key={itemId}
                  className="px-6"
                  rounded="2xl"
                  variant={
                    showResult
                      ? isCorrect
                        ? "success"
                        : "destructive"
                      : "default"
                  }
                  freez={selectedItems.length === correct.length}
                  parentClassName="w-fit flex-shrink-0"
                  onClick={() => handleItemRemove(itemId)}
                >
                  {title}
                </PressedButton>
              );
            })}
          </div>
        </div>
        <div ref={buttonRef} className="flex flex-wrap mx-auto gap-1.5 w-fit">
          {(metadata as OrderMetadata).data.map(({ id: itemId, title }) => (
            <PressedButton
              key={itemId}
              className={cn(
                "px-6",
                isItemSelected(itemId) &&
                  "text-transparent hover:bg-background group-active:bg-background pointer-events-none selection:text-transparent group-active:-top-1 group-active:border-b-1"
              )}
              rounded="2xl"
              variant={isItemSelected(itemId) ? "outline" : "default"}
              parentClassName={cn(
                "w-fit",
                isItemSelected(itemId) && "pointer-events-none"
              )}
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

export default OrderWordsBlog;
