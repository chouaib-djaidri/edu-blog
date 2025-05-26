import { QuestionProps, QuizType } from "@/types/globals";
import OneOptionBlog from "./one-option-blog";
import OrderWordsBlog from "./order-words-blog";
import MatchBlog from "./match-blog";
import OneImageBlog from "./one-image-blog";

export default function GetQuiz(props: QuestionProps) {
  switch (props.metadata.type) {
    case QuizType.ONE_IMAGE:
      return <OneImageBlog {...props} />;
    case QuizType.ONE_OPTION:
      return <OneOptionBlog {...props} />;
    case QuizType.MATCH:
      return <MatchBlog {...props} />;
    case QuizType.ORDER_WORDS:
      return <OrderWordsBlog {...props} />;
    default:
      return <></>;
  }
}
