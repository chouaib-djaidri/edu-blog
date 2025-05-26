"use client";

import PressedButton from "@/components/buttons/pressed-button";
import { useUserTestAnswer } from "@/context/user-test-answer";
import { cn } from "@/lib/utils";
import {
  OrderedResponse,
  OrderMetadata,
  QuestionProps,
  ReorderOptsQuizProps,
  TitleIdProps,
} from "@/types/globals";
import { useEffect, useRef, useState } from "react";

const OrderWordsTest = ({ metadata, id, question }: QuestionProps) => {
  const { setUserTestAnswer, userTestAnswer } = useUserTestAnswer();
  const [selectedItems, setSelectedItems] = useState<ReorderOptsQuizProps>(
    (userTestAnswer?.[id] as OrderedResponse)?.map((an) => ({
      id: an.id,
      title:
        (metadata as OrderMetadata)?.data?.find((el) => el.id === an.id)
          ?.title || "",
    })) || []
  );
  const [orderSectionSizes, setOrderSectionSizes] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleItemSelect = (item: TitleIdProps) => {
    if (!selectedItems.some((el) => el.id === item.id)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
      if (newSelectedItems.length === (metadata as OrderMetadata).data.length) {
        setUserTestAnswer((prev) => ({
          ...prev,
          [id]: newSelectedItems.map((el, index) => ({
            id: el.id,
            order: index,
          })),
        }));
      }
    }
  };

  const handleItemRemove = (itemId: string) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== itemId);
    setSelectedItems(newSelectedItems);
    if (newSelectedItems.length < (metadata as OrderMetadata).data.length) {
      if (!userTestAnswer?.[id]) return;
      setUserTestAnswer((prev) => {
        const updatedAnswers = { ...prev };
        delete updatedAnswers[id];
        return updatedAnswers;
      });
    }
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
      <h3 className="text-lg font-semibold">{question}</h3>
      <div className="space-y-6 w-full">
        <div className="pb-4 pt-4 border-t-2 border-b-2 w-full flex justify-center">
          <div
            className="flex flex-wrap gap-1.5"
            style={{
              minHeight: `${orderSectionSizes?.height}px`,
              minWidth: `${(orderSectionSizes?.width || 0) + 2}px`,
            }}
          >
            {selectedItems.map(({ id: itemId, title }) => (
              <PressedButton
                key={itemId}
                className="px-6"
                rounded="2xl"
                parentClassName="w-fit flex-shrink-0"
                onClick={() => handleItemRemove(itemId)}
              >
                {title}
              </PressedButton>
            ))}
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
    </div>
  );
};

export default OrderWordsTest;
