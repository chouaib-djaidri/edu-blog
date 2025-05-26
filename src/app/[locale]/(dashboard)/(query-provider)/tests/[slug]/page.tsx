"use client";

import LogoIcon from "@/assets/icons/logo-icon";
import PressedButton from "@/components/buttons/pressed-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const wrongAnswers = [
  {
    question: "What is the plural of cat?",
    correctAnswer: "Cats",
    suggestion: "Study plural rules for regular nouns in English grammar.",
  },
  {
    question: "What is the capital of England?",
    correctAnswer: "London",
    suggestion:
      "Review European capitals, especially UK countries and their capitals.",
  },
  {
    question: "Match the words with their meanings.",
    correctAnswer:
      '"Hello" means "Hi there", "Goodbye" means "See you", "Thank you" means "Much thanks".',
    suggestion: "Revisit common English greetings and expressions.",
  },
];

interface QuizReportCardProps {
  question: string;
  correctAnswer: string;
  suggestion: string;
}

function QuizReportCard({
  question,
  correctAnswer,
  suggestion,
}: QuizReportCardProps) {
  return (
    <div className="p-5 rounded-xl border space-y-2.5">
      <p>
        <span className="font-semibold">Question:</span> {question}
      </p>
      <Badge className="bg-green-50 text-green-900 border-green-400 whitespace-normal">
        Correct Answer: {correctAnswer}
      </Badge>
      <p>
        <span className="font-semibold">Suggestion:</span> {suggestion}
      </p>
    </div>
  );
}

const Page = () => {
  return (
    <div className="min-h-[calc(100svh-7rem)] flex flex-col">
      <div className="w-full flex-1 flex flex-col gap-3 items-center">
        <div className="w-full max-w-2xl mx-auto shrink-0 flex justify-start gap-4">
          <div className="flex gap-2 items-center">
            <LogoIcon className="h-6 w-auto" />
            <p className="text-lg font-bold pt-2 tracking-tight text-foreground">
              AI Test Feedback
            </p>
          </div>
        </div>
        <div className="max-w-2xl w-full shrink-0 min-h-px">
          <Separator className="border-b-2" />
        </div>
        <div className="w-full max-w-lg flex-1 flex flex-col justify-center gap-2 mt-1 pb-2">
          <div className="grid gap-2">
            {wrongAnswers.map((item, index) => (
              <QuizReportCard
                key={index}
                question={item.question}
                correctAnswer={item.correctAnswer}
                suggestion={item.suggestion}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <PressedButton
              type="button"
              rounded="2xl"
              parentClassName="mt-1"
              className="h-12"
            >
              Explore More Tests
            </PressedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
