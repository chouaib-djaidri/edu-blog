/* eslint-disable @typescript-eslint/no-explicit-any */
import { CATEGORY_REG, TITLE_REG } from "@/constants/reg";
import { EnglishLevel, QuizType } from "@/types/globals";
import {
  array,
  enum_,
  file,
  InferOutput,
  literal,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  nonEmpty,
  number,
  object,
  pipe,
  regex,
  string,
  union,
} from "valibot";

export const TestFormSchema = (tv?: any) => {
  return object({
    title: pipe(
      string(tv?.("title.invalid")),
      nonEmpty(tv?.("title.required")),
      minLength(5, tv?.("title.tooShort")),
      maxLength(60, tv?.("title.tooLong")),
      regex(TITLE_REG, tv?.("title.invalidFormat"))
    ),
    description: pipe(
      string(tv?.("description.invalid")),
      nonEmpty(tv?.("description.required")),
      minLength(20, tv?.("description.tooShort")),
      maxLength(250, tv?.("description.tooLong"))
    ),
    level: enum_(EnglishLevel, tv?.("level.invalid")),
    categories: pipe(
      array(
        pipe(
          string(tv?.("category.invalid")),
          regex(CATEGORY_REG, tv?.("category.invalidFormat"))
        ),
        tv?.("categories.invalid")
      ),
      minLength(1, tv?.("categories.min")),
      maxLength(3, tv?.("categories.max"))
    ),
    coverFile: union([
      pipe(
        file(tv?.("cover.required")),
        mimeType(["image/jpeg", "image/png"], tv?.("cover.invalidMime")),
        maxSize(1024 * 1024 * 5, tv?.("cover.maxSize"))
      ),
      pipe(string(), nonEmpty(tv?.("cover.required"))),
      literal(""),
    ]),
    quizzes: union([
      pipe(
        array(
          object({
            question: pipe(
              string(tv?.("quizTitle.invalid")),
              nonEmpty(tv?.("quizTitle.required")),
              minLength(5, tv?.("quizTitle.tooShort")),
              maxLength(60, tv?.("quizTitle.tooLong"))
            ),
            metadata: union([
              object({
                type: literal(QuizType.ONE_OPTION),
                data: array(
                  object({
                    id: pipe(
                      string(tv?.("id.invalid")),
                      nonEmpty(tv?.("id.required"))
                    ),
                    title: pipe(
                      string(tv?.("title.invalid")),
                      nonEmpty(tv?.("title.required"))
                    ),
                  })
                ),
                correctAnswer: object({
                  id: string(tv?.("id.invalid")),
                }),
              }),
              object({
                type: literal(QuizType.ONE_IMAGE),
                data: array(
                  object({
                    id: string(tv?.("id.invalid")),
                    imageUrl: union(
                      [
                        pipe(
                          file(tv?.("image.required")),
                          mimeType(
                            ["image/jpeg", "image/png"],
                            tv?.("image.invalidMime")
                          ),
                          maxSize(1024 * 1024 * 5, tv?.("image.maxSize"))
                        ),
                        pipe(string(), nonEmpty(tv?.("image.required"))),
                      ],
                      tv?.("image.invalid")
                    ),
                  }),
                  tv?.("metadata.invalid")
                ),
                correctAnswer: object({
                  id: string(tv?.("id.invalid")),
                }),
              }),
              object({
                type: literal(QuizType.ORDER_WORDS),
                data: array(
                  object({
                    id: pipe(
                      string(tv?.("id.invalid")),
                      nonEmpty(tv?.("id.required"))
                    ),
                    title: pipe(
                      string(tv?.("title.invalid")),
                      nonEmpty(tv?.("title.required"))
                    ),
                  }),
                  tv?.("metadata.invalid")
                ),
                correctAnswer: array(
                  object({
                    id: string(tv?.("id.invalid")),
                    order: number(tv?.("order.invalid")),
                  })
                ),
              }),
              object({
                type: literal(QuizType.MATCH),
                data: object({
                  l: array(
                    object({
                      id: pipe(
                        string(tv?.("id.invalid")),
                        nonEmpty(tv?.("id.required"))
                      ),
                      title: pipe(
                        string(tv?.("title.invalid")),
                        nonEmpty(tv?.("title.required"))
                      ),
                    }),
                    tv?.("metadata.invalid")
                  ),
                  r: array(
                    object({
                      id: pipe(
                        string(tv?.("id.invalid")),
                        nonEmpty(tv?.("id.required"))
                      ),
                      title: pipe(
                        string(tv?.("title.invalid")),
                        nonEmpty(tv?.("title.required"))
                      ),
                    }),
                    tv?.("metadata.invalid")
                  ),
                }),
                correctAnswer: array(
                  object({
                    id: string(tv?.("id.invalid")),
                    order: number(tv?.("order.invalid")),
                  })
                ),
              }),
            ]),
            id: pipe(
              string(tv?.("quizId.invalid")),
              nonEmpty(tv?.("quizId.required"))
            ),
            order: number(tv?.("order.invalid")),
          })
        ),
        minLength(5, tv?.("quizzes.min")),
        maxLength(30, tv?.("quizzes.max"))
      ),
    ]),
  });
};

export type TestFormValues = InferOutput<ReturnType<typeof TestFormSchema>>;
export type TestFormKeys = keyof TestFormValues;

export const TEST_DEFAULT_FORM_VALUES: TestFormValues = {
  title: "",
  description: "",
  level: EnglishLevel.B1,
  categories: [],
  quizzes: [],
  coverFile: "",
};
