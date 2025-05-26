/* eslint-disable @typescript-eslint/no-explicit-any */
import { CATEGORY_REG, TITLE_REG } from "@/constants/reg";
import {
  ChooseImgQuizProps,
  ChooseOptQuizProps,
  EnglishLevel,
  MatchOptsQuizProps,
  QuizMetada,
  QuizType,
  ReorderOptsQuizProps,
} from "@/types/globals";
import {
  any,
  array,
  enum_,
  file,
  GenericSchema,
  InferOutput,
  lazy,
  literal,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  nonEmpty,
  number,
  object,
  optional,
  pipe,
  record,
  regex,
  string,
  union,
} from "valibot";

// Editor.js content schema
const EditorBlockSchema: GenericSchema<any> = object({
  id: optional(string()),
  type: string(),
  data: any(),
});

const EditorJSContentSchema: GenericSchema<any> = object({
  time: optional(number()),
  blocks: array(EditorBlockSchema),
  version: optional(string()),
});

// Keep Novel's JSONContent schema for backward compatibility
const JSONContentSchema: GenericSchema<any> = object({
  type: optional(string()),
  attrs: optional(record(string(), any())),
  content: optional(array(lazy(() => JSONContentSchema))),
  marks: optional(
    array(
      object({
        type: string(),
        attrs: optional(record(string(), any())),
      })
    )
  ),
  text: optional(string()),
});

export const BlogFormSchema = (tv?: any) => {
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
    coverFile: union(
      [
        pipe(
          file(tv?.("cover.required")),
          mimeType(["image/jpeg", "image/png"], tv?.("cover.invalidMime")),
          maxSize(1024 * 1024 * 5, tv?.("cover.maxSize"))
        ),
        pipe(string(), nonEmpty(tv?.("cover.required"))),
      ],
      tv?.("cover.invalid")
    ),
    quiz: union([
      literal(""),
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
      }),
    ]),
    // Support both Editor.js and Novel content formats
    content: union([EditorJSContentSchema, JSONContentSchema]),
  });
};

export type BlogFormValues = InferOutput<ReturnType<typeof BlogFormSchema>>;
export type BlogFormKeys = keyof BlogFormValues;

export const BLOG_DEFAULT_FORM_VALUES: BlogFormValues = {
  title: "",
  description: "",
  level: EnglishLevel.B1,
  categories: [],
  // Default to Editor.js format
  content: {
    blocks: [{ type: 'paragraph', data: { text: '' } }]
  },
  coverFile: "",
  quiz: "",
};

export const createQuizMetadata = (type: QuizType): "" | QuizMetada => {
  switch (type) {
    case QuizType.ONE_OPTION:
      const correctId = crypto.randomUUID();
      return {
        type: QuizType.ONE_OPTION,
        data: [
          { id: correctId, title: "" },
          { id: crypto.randomUUID(), title: "" },
        ] as ChooseOptQuizProps,
        correctAnswer: { id: correctId },
      };
    case QuizType.ONE_IMAGE:
      const correctImageId = crypto.randomUUID();
      return {
        type: QuizType.ONE_IMAGE,
        data: [
          { id: correctImageId, imageUrl: "" },
          { id: crypto.randomUUID(), imageUrl: "" },
        ] as ChooseImgQuizProps,
        correctAnswer: { id: correctImageId },
      };
    case QuizType.ORDER_WORDS:
      const orderData = [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ];
      return {
        type: QuizType.ORDER_WORDS,
        data: orderData.map((el) => ({
          id: el,
          title: "",
        })) as ReorderOptsQuizProps,
        correctAnswer: orderData.map((el, index) => ({ id: el, order: index })),
      };
    case QuizType.MATCH:
      const matchData = [
        crypto.randomUUID(),
        crypto.randomUUID(),
        crypto.randomUUID(),
      ];
      return {
        type: QuizType.MATCH,
        data: {
          l: [
            { id: crypto.randomUUID(), title: "" },
            { id: crypto.randomUUID(), title: "" },
            { id: crypto.randomUUID(), title: "" },
          ],
          r: matchData.map((el) => ({
            id: el,
            title: "",
          })),
        } as MatchOptsQuizProps,
        correctAnswer: matchData.map((el, index) => ({ id: el, order: index })),
      };
    default:
      return "";
  }
};
