import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable";
import { cn } from "@/lib/utils";
import { TestFormValues } from "@/schemas/creator/test-form.schema";
import { QuestionProps } from "@/types/globals";
import { GripHorizontal, PlusCircle, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";

const QuizzesOrdering = ({
  quizzes,
  currentQuiz,
  onOrderChange,
  setCurrentQuiz,
  onDelete,
  handleAddQuizClick,
}: {
  quizzes: QuestionProps[];
  currentQuiz: number;
  onOrderChange: (newQuizzes: QuestionProps[]) => void;
  setCurrentQuiz: Dispatch<SetStateAction<number>>;
  onDelete: (id: string) => void;
  handleAddQuizClick: () => void;
}) => {
  const {
    formState: {
      errors: { quizzes: quizzesErrors },
    },
  } = useFormContext<TestFormValues>();
  const t = useTranslations("NewTest");
  const tb = useTranslations("Buttons");
  if (!quizzes.length)
    return (
      <div className="p-4 border-s w-full flex flex-col justify-center">
        <p className="text-center text-muted-foreground">{t("noQuizzess")}</p>
      </div>
    );
  return (
    <Sortable
      value={quizzes}
      onValueChange={(items) => {
        const newQuizzes = items.map((el, index) => ({
          ...el,
          displayOrder: index,
        }));
        onOrderChange(newQuizzes);
      }}
      overlay={<div className="h-14 bg-muted/5"></div>}
    >
      <div className="border-s flex-1 flex flex-col overflow-hidden w-full max-h-[calc(100svh-10.25rem)]">
        <ScrollArea className="w-full h-full">
          <div>
            {quizzes.map((field, index) => (
              <SortableItem key={field.id} value={field.id} asChild>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 border-b h-14 cursor-pointer",
                    currentQuiz === index && "bg-primary/10"
                  )}
                  onClick={() => {
                    setCurrentQuiz(index);
                  }}
                >
                  <SortableDragHandle
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0 hover:bg-transparent"
                  >
                    <GripHorizontal className="size-4" aria-hidden="true" />
                  </SortableDragHandle>
                  <div className="flex-1">
                    <p
                      className={cn(
                        "line-clamp-1 font-medium text-sm",
                        !!quizzesErrors?.[index] && "text-destructive"
                      )}
                      title={field.question}
                    >
                      {field.question || "Quiz question"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {field.metadata.type}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(field.id);
                    }}
                  >
                    <TrashIcon
                      className="size-4 text-destructive"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{tb("remove")}</span>
                  </Button>
                </div>
              </SortableItem>
            ))}
          </div>
          <div className="h-14 p-2">
            <Button
              className="h-10 w-full border-dashed border-2"
              onClick={handleAddQuizClick}
              variant="outline"
            >
              <PlusCircle className="size-4.5" />
              {tb("addNewQuiz")}
            </Button>
          </div>
        </ScrollArea>
      </div>
    </Sortable>
  );
};

export default QuizzesOrdering;
