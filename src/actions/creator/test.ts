/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { handleUploadFile } from "@/lib/bunny/upload-file";
import { slugify } from "@/lib/paths";
import { supabaseServer } from "@/lib/supabase/server";
import { nanoid } from "@/lib/utils";
import { TestFormSchema } from "@/schemas/creator/test-form.schema";
import { FormActionResponse, QuizType } from "@/types/globals";
import { revalidatePath } from "next/cache";
import "server-only";
import { safeParse } from "valibot";

export const addTestAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const supabase = await supabaseServer();
  let testId: string = "";
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const level = formData.get("level") as string;
    const categories = formData.getAll("categories") as string[];
    const coverFile = formData.get("coverFile") as File;
    const quizzesRaw = formData.getAll("quizzes");

    const quizzes = quizzesRaw.map((el) => JSON.parse(el as string));
    const quizImageMapRaw = formData.get("quizImageMap");
    const quizImageMap = quizImageMapRaw
      ? JSON.parse(quizImageMapRaw as string)
      : {};

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const validationResult = safeParse(TestFormSchema(), {
      title,
      coverFile,
      description,
      level,
      categories,
      quizzes,
    });

    if (!validationResult.success || !userId) {
      return {
        err: "validationError",
      };
    }

    const imageUrl = await handleUploadFile(coverFile, "test-covers");
    if (!imageUrl) return { err: "tests.uploadError" };

    const slug = slugify(title) + "-" + nanoid(6);

    const { data: testData, error: testError } = await supabase
      .from("tests")
      .insert({
        title,
        slug,
        description,
        level,
        categories: categories,
        cover_url: imageUrl,
        user_id: userId,
      } as any)
      .select()
      .single();

    if (testError || !testData) {
      return testError?.message?.includes("duplicate")
        ? { err: "tests.duplicated" }
        : { err: "tests.addFailed" };
    }
    testId = testData.id;

    const uploadedImageUrls: Record<string, string> = {};
    for (const quizId in quizImageMap) {
      const fileIndex = quizImageMap[quizId];
      const imageFile = formData.get(`quizImage_${fileIndex}`) as File;
      if (imageFile && imageFile instanceof File) {
        const uploadedUrl = await handleUploadFile(imageFile, "quiz-images");
        if (uploadedUrl) {
          uploadedImageUrls[quizId] = uploadedUrl as string;
        }
      }
    }

    const quizInsertPromises = quizzes.map(async (quiz, index) => {
      if (quiz.metadata.type === QuizType.ONE_IMAGE) {
        const updatedData = quiz.metadata.data.map((item: any) => {
          if (uploadedImageUrls[item.id]) {
            return {
              ...item,
              imageUrl: uploadedImageUrls[item.id],
            };
          }
          return item;
        });
        quiz.metadata.data = updatedData;
      }
      const { data: quizData, error: quizError } = await supabase
        .from("test_quizzes")
        .insert({
          test_id: testData.id,
          question: quiz.question,
          type: quiz.metadata.type,
          data: quiz.metadata.data,
          quiz_order: quiz.order || index + 1,
        })
        .select()
        .single();
      if (quizError || !quizData) {
        throw new Error(`Failed to insert quiz: ${quizError?.message}`);
      }
      return { quizData, correctAnswer: quiz.metadata.correctAnswer };
    });
    const quizResults = await Promise.all(quizInsertPromises);
    const answerInsertPromises = quizResults.map(
      ({ quizData, correctAnswer }) => {
        return supabase.from("test_quiz_correct_answers").insert({
          quiz_id: quizData.id,
          answer_data: correctAnswer,
        });
      }
    );
    await Promise.all(answerInsertPromises);
    await revalidatePath("/(dashboard)/(query-provider)", "layout");

    return {
      msg: "tests.addSuccess",
      data: testData,
    };
  } catch {
    if (testId) await supabase.from("tests").delete().eq("id", testId);
    return {
      err: "tests.addFailed",
    };
  }
};

export const updateTestAction = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const testId = formData.get("testId") as string;
  const userId = formData.get("userId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const level = formData.get("level") as string;
  const categories = formData.getAll("categories") as string[];
  const coverFile = formData.get("coverFile") as File | string;
  const defaultQuizzesRaw = formData.getAll("defaultQuizzes");
  const defaultQuizzes =
    defaultQuizzesRaw.length > 0
      ? defaultQuizzesRaw.map((el) => JSON.parse(el as string))
      : null;
  const quizzesRaw = formData.getAll("quizzes");
  const quizzes =
    quizzesRaw.length > 0
      ? quizzesRaw.map((el) => JSON.parse(el as string))
      : null;
  const quizImageMapRaw = formData.get("quizImageMap");
  const quizImageMap = quizImageMapRaw
    ? JSON.parse(quizImageMapRaw as string)
    : {};

  const validationResult = safeParse(TestFormSchema(), {
    title: title || "Title",
    coverFile: coverFile || "",
    description:
      description || "This is used for skipe the description validation",
    level: level || "A1",
    categories: categories.length > 0 ? categories : ["category"],
    quizzes: quizzes,
  });

  if (
    !validationResult.success ||
    !testId ||
    !userId ||
    !quizzes?.length ||
    !defaultQuizzes?.length
  ) {
    return {
      err: "validationError",
    };
  }

  const supabase = await supabaseServer();

  try {
    let coverUrl: false | string = "";
    if (coverFile && coverFile instanceof File && coverFile.size > 0) {
      coverUrl = await handleUploadFile(coverFile, "test-covers");
      if (!coverUrl) return { err: "tests.uploadError" };
    }

    if (
      title ||
      description ||
      level ||
      categories.length > 0 ||
      coverUrl ||
      coverFile === "deleted"
    ) {
      const updateData: any = {};

      if (title) {
        updateData.title = title;
        updateData.slug = slugify(title) + "-" + nanoid(6);
      }
      if (description) updateData.description = description;
      if (level) updateData.level = level;
      if (categories.length > 0) updateData.categories = categories;
      if (coverUrl || coverFile === "deleted") {
        updateData.cover_url = coverUrl || null;
      }

      const { error: testUpdateError } = await supabase
        .from("tests")
        .update(updateData)
        .eq("id", testId);

      if (testUpdateError) {
        return { err: "tests.updateFailed" };
      }
    }

    const uploadedImageUrls: Record<string, string> = {};
    for (const quizId in quizImageMap) {
      const fileIndex = quizImageMap[quizId];
      const imageFile = formData.get(`quizImage_${fileIndex}`) as File;
      if (imageFile && imageFile instanceof File) {
        const uploadedUrl = await handleUploadFile(imageFile, "quiz-images");
        if (uploadedUrl) {
          uploadedImageUrls[quizId] = uploadedUrl as string;
        }
      }
    }

    const defaultQuizMap = new Map(
      defaultQuizzes.map((quiz) => [quiz.id, quiz])
    );
    const newQuizMap = new Map(quizzes.map((quiz) => [quiz.id, quiz]));

    const quizzesToDelete = defaultQuizzes
      .filter((quiz) => !newQuizMap.has(quiz.id))
      .map((quiz) => quiz.id);

    const quizzesToAdd = quizzes.filter((quiz) => !defaultQuizMap.has(quiz.id));

    const quizzesToUpdate = quizzes.filter((quiz) => {
      if (!defaultQuizMap.has(quiz.id)) return false;
      const defaultQuiz = defaultQuizMap.get(quiz.id);
      return (
        quiz.question !== defaultQuiz.question ||
        quiz.metadata.type !== defaultQuiz.metadata.type ||
        JSON.stringify(quiz.metadata.data) !==
          JSON.stringify(defaultQuiz.metadata.data) ||
        quiz.order !== defaultQuiz.order
      );
    });

    if (quizzesToDelete.length > 0) {
      const { error: deleteAnswersError } = await supabase
        .from("test_quiz_correct_answers")
        .delete()
        .in("quiz_id", quizzesToDelete);

      if (deleteAnswersError) {
        return { err: "tests.updateFailed" };
      }
      const { error: deleteQuizzesError } = await supabase
        .from("test_quizzes")
        .delete()
        .in("id", quizzesToDelete);

      if (deleteQuizzesError) {
        return { err: "tests.updateFailed" };
      }
    }

    if (quizzesToAdd.length > 0) {
      const addPromises = quizzesToAdd.map(async (quiz, index) => {
        if (quiz.metadata.type === QuizType.ONE_IMAGE) {
          const updatedData = quiz.metadata.data.map((item: any) => {
            if (uploadedImageUrls[item.id]) {
              return {
                ...item,
                imageUrl: uploadedImageUrls[item.id],
              };
            }
            return item;
          });
          quiz.metadata.data = updatedData;
        }
        const { data: quizData, error: quizError } = await supabase
          .from("test_quizzes")
          .insert({
            test_id: testId,
            question: quiz.question,
            type: quiz.metadata.type,
            data: quiz.metadata.data,
            quiz_order: quiz.order || defaultQuizzes.length + index + 1,
          })
          .select()
          .single();
        if (quizError || !quizData) {
          throw new Error(`Failed to insert quiz: ${quizError?.message}`);
        }
        const { error: answerError } = await supabase
          .from("test_quiz_correct_answers")
          .insert({
            quiz_id: quizData.id,
            answer_data: quiz.metadata.correctAnswer,
          });
        if (answerError) {
          throw new Error(`Failed to insert answer: ${answerError?.message}`);
        }
        return quizData;
      });
      await Promise.all(addPromises);
    }

    // Update existing quizzes
    if (quizzesToUpdate.length > 0) {
      const updatePromises = quizzesToUpdate.map(async (quiz) => {
        if (quiz.metadata.type === QuizType.ONE_IMAGE) {
          const updatedData = quiz.metadata.data.map((item: any) => {
            if (uploadedImageUrls[item.id]) {
              return {
                ...item,
                imageUrl: uploadedImageUrls[item.id],
              };
            }
            return item;
          });
          quiz.metadata.data = updatedData;
        }
        const { error: quizUpdateError } = await supabase
          .from("test_quizzes")
          .update({
            question: quiz.question,
            type: quiz.metadata.type,
            data: quiz.metadata.data,
            quiz_order: quiz.order,
          })
          .eq("id", quiz.id);
        if (quizUpdateError) {
          throw new Error(`Failed to update quiz: ${quizUpdateError?.message}`);
        }
        const { error: answerUpdateError } = await supabase
          .from("test_quiz_correct_answers")
          .update({
            answer_data: quiz.metadata.correctAnswer,
          })
          .eq("quiz_id", quiz.id);
        if (answerUpdateError) {
          throw new Error(
            `Failed to update answer: ${answerUpdateError?.message}`
          );
        }
      });
      await Promise.all(updatePromises);
    }

    await revalidatePath("/(dashboard)/(query-provider)", "layout");

    return {
      msg: "tests.updateSuccess",
      data: { id: testId },
    };
  } catch {
    return {
      err: "tests.updateFailed",
    };
  }
};
