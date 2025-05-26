"use client";

import { QuestionProps, QuizType } from "@/types/globals";
import OneOptionTest from "./one-option-test";
import OrderWordsTest from "./order-words-test";
import MatchTest from "./match-test";
import OneImageTest from "./one-image-test";

export default function GetQuiz(props: QuestionProps) {
  switch (props.metadata.type) {
    case QuizType.ONE_IMAGE:
      return <OneImageTest {...props} />;
    case QuizType.ONE_OPTION:
      return <OneOptionTest {...props} />;
    case QuizType.MATCH:
      return <MatchTest {...props} />;
    case QuizType.ORDER_WORDS:
      return <OrderWordsTest {...props} />;
    default:
      return <></>;
  }
}
