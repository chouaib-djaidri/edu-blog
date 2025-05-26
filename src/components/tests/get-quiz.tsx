/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { QuizType } from "@/types/globals";
import MatchTest from "../forms/creator/new-test-form/preview/match-test";
import OneImageTest from "../forms/creator/new-test-form/preview/one-image-test";
import OneOptionTest from "../forms/creator/new-test-form/preview/one-option-test";
import OrderWordsTest from "../forms/creator/new-test-form/preview/order-words-test";

export default function GetQuiz(props: any) {
  switch (props.type) {
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
