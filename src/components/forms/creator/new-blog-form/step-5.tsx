import { BlogFormValues } from "@/schemas/creator/blog-form.schema";
import { useFormContext } from "react-hook-form";
import { QuestionProps } from "@/types/globals";
import GetQuiz from "./preview/get-quiz";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import EffectIcon from "@/assets/icons/effect-icon";

const Step5 = () => {
  const { watch } = useFormContext<BlogFormValues>();
  const currentQuiz = watch("quiz") as QuestionProps;
  return (
    <div className="p-6 h-full">
      <div className="border px-6 pt-10 pb-8 rounded-xl">
        <div className="mb-4 flex justify-center">
          <div className="relative text-orange-700">
            <EffectIcon className="size-7 absolute -start-8 -top-4" />
            <EffectIcon className="size-7 absolute -end-8 -top-4" />
            <Badge className="px-6 pt-2 pb-1.5 bg-orange-700 text-white border-0 text-sm">
              <span className="inline-flex pb-0.5">
                <Flame className="size-4.5" />
              </span>
              Challenge
            </Badge>
          </div>
        </div>
        {currentQuiz && <GetQuiz {...currentQuiz} />}
      </div>
    </div>
  );
};

export default Step5;
