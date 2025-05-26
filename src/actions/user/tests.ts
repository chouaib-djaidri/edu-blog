/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import "server-only";

import {
  getEnglishLevel,
  processQuizzes,
  validateResponses,
} from "@/lib/utils";
import { EnglishLevel, FormActionResponse, QuizType } from "@/types/globals";
import supabaseAdmin from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";

export const getLevelTest = async (): Promise<any> => {
  const allQuizzes = [
    ...processQuizzes(QUIZZES_A1),
    ...processQuizzes(QUIZZES_A2),
    ...processQuizzes(QUIZZES_B1),
    ...processQuizzes(QUIZZES_B2),
    ...processQuizzes(QUIZZES_C1),
    ...processQuizzes(QUIZZES_C2),
  ];

  return {
    test: PLACEMENT_TEST,
    questions: allQuizzes,
  };
};

export const getLevelTestCorrectAnswers = async (): Promise<any> => {
  return {
    ...QUIZZES_ANSWERS_A1,
    ...QUIZZES_ANSWERS_A2,
    ...QUIZZES_ANSWERS_B1,
    ...QUIZZES_ANSWERS_B2,
    ...QUIZZES_ANSWERS_C1,
    ...QUIZZES_ANSWERS_C2,
  };
};
export const initilizeUserProgress = async (
  formData: FormData
): Promise<FormActionResponse> => {
  const skip = formData.get("skip") as string;
  const userTestAnswerRaw = formData.get("userTestAnswer") as string;
  const userTestAnswer = userTestAnswerRaw
    ? JSON.parse(userTestAnswerRaw)
    : null;
  const questionsRaw = formData.getAll("questions");
  const questions =
    questionsRaw.length > 0
      ? questionsRaw.map((el) => JSON.parse(el as string))
      : null;
  const supabaseAd = supabaseAdmin();
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (skip) {
    if (!session?.user) return { err: "initialProgressfailed" };
    const { error } = await supabaseAd.from("user_progress").insert({
      user_id: session.user.id,
    });
    if (error) return { err: "initialProgressfailed" };

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ on_boarding_status: "done" })
      .eq("user_id", session.user.id);

    if (profileError) return { err: "initialProgressfailed" };

    return { msg: "success", data: { level: EnglishLevel.A1 } };
  }

  if (!session?.user || !userTestAnswer || !questions?.length)
    return { err: "initialProgressfailed" };

  let userLevel = EnglishLevel.A1;

  const result1 = validateResponses(
    userTestAnswer,
    { ...QUIZZES_ANSWERS_A1 },
    questions.filter((el) => el.level === EnglishLevel.A1)
  );
  const result2 = validateResponses(
    userTestAnswer,
    { ...QUIZZES_ANSWERS_A2 },
    questions.filter((el) => el.level === EnglishLevel.A2)
  );
  const result3 = validateResponses(
    userTestAnswer,
    { ...QUIZZES_ANSWERS_B1 },
    questions.filter((el) => el.level === EnglishLevel.B1)
  );
  const result4 = validateResponses(
    userTestAnswer,
    { ...QUIZZES_ANSWERS_B2 },
    questions.filter((el) => el.level === EnglishLevel.B2)
  );
  const result5 = validateResponses(
    userTestAnswer,
    { ...QUIZZES_ANSWERS_C1 },
    questions.filter((el) => el.level === EnglishLevel.C1)
  );

  if (result1.correct >= 4) {
    userLevel = EnglishLevel.A2;
  }

  if (result1.correct >= 4 && result2.correct >= 4) {
    userLevel = EnglishLevel.B1;
  }

  if (result1.correct >= 5 && result2.correct >= 5 && result3.correct >= 4) {
    userLevel = EnglishLevel.B2;
  }

  if (
    result1.correct >= 5 &&
    result2.correct >= 5 &&
    result3.correct >= 5 &&
    result4.correct >= 4
  ) {
    userLevel = EnglishLevel.C1;
  }

  if (
    result1.correct >= 5 &&
    result2.correct >= 5 &&
    result3.correct >= 5 &&
    result4.correct >= 4 &&
    result5.correct >= 5
  ) {
    userLevel = EnglishLevel.C2;
  }

  const earnedPoints = getEnglishLevel(userLevel);

  const { error } = await supabaseAd.from("user_points_history").insert({
    points_earned: earnedPoints,
    source_type: "initial",
    user_id: session.user.id,
  });
  if (error) return { err: "initialProgressfailed" };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ on_boarding_status: "done" })
    .eq("user_id", session.user.id);

  if (profileError) return { err: "initialProgressfailed" };

  return { msg: "success", data: { level: userLevel } };
};

const PLACEMENT_TEST = {
  id: "35f2fc5a-bdf9-4231-9210-8dfd45e69b17",
  title: "English Level Test",
};

const QUIZZES_A1 = [
  {
    id: "f12db601-0fb3-47b7-aabd-0f4a57f8b7d1",
    question: "What is the capital of England?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "ed6e59c9-12f2-4f34-b61a-b651c01fb9b7", title: "Paris" },
        { id: "b8ba13e1-91b7-4659-8264-ff8d72f43f16", title: "London" },
        { id: "9f0a88c4-5577-4bdf-b2a4-9735c8f5f64c", title: "Berlin" },
      ],
    },
    level: "A1",
  },
  {
    id: "20ab34ce-2257-4fae-ae9a-0fbba5cb045d",
    question: "Select the correct image for an apple.",
    type: QuizType.ONE_IMAGE,
    metadata: {
      data: [
        {
          id: "3a6c3b8c-8046-4c63-bf84-17d6c6ab9f16",
          imageUrl: "3a6c7b8c-8010-4c63-bf84-17d6c4ab9f16.png",
        },
        {
          id: "ab48c5f9-8ed2-4cf4-8437-8cd7e9fa9d2c",
          imageUrl: "4v7c3b8c-9951-4c01-bf84-17d6c6ab2d77.png",
        },
      ],
    },
    level: "A1",
  },
  {
    id: "bfec2b88-7df4-4c3e-8882-18ff8f5a43e1",
    question: "Arrange the words to make a correct sentence",
    type: QuizType.ORDER_WORDS,
    metadata: {
      data: [
        { id: "6fa5f94a-62be-47c2-8890-8eac3f276f4e", title: "I" },
        { id: "e9d7b7fc-65c1-4d84-8a4d-b19d63443a68", title: "am" },
        { id: "1091cf07-516f-4450-86ec-c064fd2f6afb", title: "a" },
        { id: "a839c4c9-6f23-4f94-bc34-6f6f9b7e2ad1", title: "student" },
      ],
    },
    level: "A1",
  },
  {
    id: "7a80d2cb-3081-4ea9-9dc2-67e84a01468b",
    question: "Match the words with their meanings.",
    type: QuizType.MATCH,
    metadata: {
      data: {
        l: [
          { id: "be5d59c1-5d2f-4c52-92a8-f4f9f9d3b02f", title: "Hello" },
          { id: "278ade41-c5c9-4568-ae59-d3795bc6f534", title: "Goodbye" },
          { id: "ad4f2a39-33d5-4ff9-b9ce-5adf78fcb9cd", title: "Thank you" },
        ],
        r: [
          { id: "37fbdf6c-26c7-4741-9a7d-8c2ac3d2df17", title: "Hi there" },
          { id: "b2f9af51-734e-45a4-8c54-2a6e9db1d0d3", title: "See you" },
          { id: "f7c65cb0-9345-4263-9739-1e0f4dfe4c5a", title: "Much thanks" },
        ],
      },
    },
    level: "A1",
  },
  {
    id: "ea6fcde0-6020-41da-a34f-187dcedc34b5",
    question: "What is the plural of cat?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "4d1ba747-52bb-4ef6-bcee-30e8023fa029", title: "Cats" },
        { id: "77ba4266-54c7-47be-9b1b-6561f711c7f3", title: "Cates" },
        { id: "4528b8c2-582f-4cf9-a812-2f5a28f65b48", title: "Cat" },
      ],
    },
    level: "A1",
  },
];

const QUIZZES_A2 = [
  {
    id: "c4c6d987-19a5-4022-bc18-4c8dc1e4e2fa",
    question: "Which of these countries is in South America?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "29ba4bd6-c7c6-4dd1-8f20-f2fddc6e6419", title: "Spain" },
        { id: "996f6fb0-bd1f-487b-910c-5e15f4fa4ed2", title: "Brazil" },
        { id: "32e3a29d-f68d-45b1-828f-fc50f9c1921f", title: "Germany" },
      ],
    },
    level: "A2",
  },
  {
    id: "f71886d5-1422-43d3-91a7-2f7ccbe779e2",
    question: "Select the correct image for a motorbike.",
    type: QuizType.ONE_IMAGE,
    metadata: {
      data: [
        {
          id: "5de6e9c1-8f64-464c-95d0-f63e0c4f9fb9",
          imageUrl: "e1c8fc62-69d9-40fa-a5d5-b9f96e65e7f7.png",
        },
        {
          id: "4013d3a5-2d4c-42df-a506-2b4875c7ec32",
          imageUrl: "98d1290c-d0c0-43f7-801d-49872d7b3b7a.png",
        },
      ],
    },
    level: "A2",
  },
  {
    id: "b8b9e0c9-96e8-4d53-a6d8-b630ef6aa2ec",
    question: "Arrange the words to make a correct question.",
    type: QuizType.ORDER_WORDS,
    metadata: {
      data: [
        { id: "2015a208-4f6e-4cc5-b49e-1549f0f7a264", title: "Do" },
        { id: "fab8c9d1-5075-4044-8db1-fb4b5a1f8d65", title: "you" },
        { id: "8c7e5d86-c88d-4823-b312-5a0ddcf1dc8b", title: "like" },
        { id: "6f3790fb-5f17-4bfa-92f2-7e6fd73b30d4", title: "pizza" },
        { id: "ec2b71a0-6895-4539-801f-356b36d58949", title: "?" },
      ],
    },
    level: "A2",
  },
  {
    id: "2d56f9b6-3629-463c-9d60-8f2b27af5df4",
    question: "Match the verbs with their past forms.",
    type: QuizType.MATCH,
    metadata: {
      data: {
        l: [
          { id: "5fb54ed9-9e98-4d45-bb64-c5d3bf6813dd", title: "Go" },
          { id: "b0f299a9-5a95-497f-b56e-3082dbdc8e63", title: "Eat" },
          { id: "7460a8ec-6d6f-4f73-a5bb-64d9c7d8504f", title: "See" },
        ],
        r: [
          { id: "be0c4ff1-9370-4f0f-bfcd-fccfdc6890af", title: "Went" },
          { id: "5dc6ba33-cd9d-4f1d-9443-1d470ba9c11a", title: "Ate" },
          { id: "9a29f3f1-515a-4d0f-9349-8c62d249bca7", title: "Saw" },
        ],
      },
    },
    level: "A2",
  },
  {
    id: "e37f0c58-9670-4a7f-91e9-8c7f6e5315e2",
    question: "Which sentence is grammatically correct?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        {
          id: "1dcdccb9-7c31-4e9c-847a-c17db50fa80f",
          title: "She go to school every day.",
        },
        {
          id: "6d6c05bb-f6a5-4fd8-865b-85b0b9c1a1ad",
          title: "She goes to school every day.",
        },
        {
          id: "79de75dd-0604-42f7-a06e-b3909b4c1a44",
          title: "She going to school every day.",
        },
      ],
    },
    level: "A2",
  },
];

const QUIZZES_B1 = [
  {
    id: "1f2957c1-bc4d-4e2a-8d65-7342f7c0deed",
    question: "Which of these is a renewable energy source?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "a0f72fdb-9465-4c0c-a26d-7855ca950c1c", title: "Coal" },
        { id: "ad3762c4-9754-4d2d-87e7-760e21dbd065", title: "Solar" },
        { id: "0f81f1ef-3f4a-4a9c-92eb-44c50984ed31", title: "Oil" },
      ],
    },
    level: "B1",
  },
  {
    id: "7fdbf0d3-8729-4cd2-8be0-4cfb4c5780c9",
    question: "Select the correct image for a wind turbine.",
    type: QuizType.ONE_IMAGE,
    metadata: {
      data: [
        {
          id: "d4b29dfb-7f1d-44f5-8c54-8f3e5d76a1c9",
          imageUrl: "qw13d3a5-2wdc-42df-a506-2b4875c7ecbd.png",
        },
        {
          id: "79254af4-8b98-4b3c-80b1-cbe2e4b3f493",
          imageUrl: "7bebf2d3-8049-4cd2-8bd5-4cfb4c578959.png",
        },
      ],
    },
    level: "B1",
  },
  {
    id: "f06668c3-3c2e-4e8a-abc2-96a4b48dc345",
    question: "Arrange the words to make a correct sentence.",
    type: QuizType.ORDER_WORDS,
    metadata: {
      data: [
        { id: "c51e08d2-70f8-419b-ae74-06b2c4573e3c", title: "I" },
        { id: "0d8a1496-861d-4c1f-83f1-2f4143c7d6e5", title: "have" },
        { id: "c47c0320-c25e-4a74-8dc1-0584953ea055", title: "never" },
        { id: "5a2e0e5f-cf9e-4239-b9d8-799cceee0e57", title: "been" },
        { id: "ebfface9-d61d-43f5-a8af-05f47cc18a07", title: "there" },
        { id: "db81d433-4509-4329-91b7-6a01f1a3efec", title: "before" },
      ],
    },
    level: "B1",
  },
  {
    id: "4d60710b-57b0-4c93-a507-163dc09b67bd",
    question: "Match the animals with their sounds.",
    type: QuizType.MATCH,
    metadata: {
      data: {
        l: [
          { id: "b90e1091-64c3-4a3a-8123-5c7f01d2f7af", title: "Dog" },
          { id: "449eb23f-3317-4fd2-bf3a-c1f5e723a8b1", title: "Cat" },
          { id: "d738d45f-65f3-4b43-8f60-8b07ef26db95", title: "Cow" },
        ],
        r: [
          { id: "9de6d402-bd1e-4b74-85c3-d9d1061edb1c", title: "Bark" },
          { id: "27e774b3-0a8d-4c9a-8c33-5ef1dba71e0a", title: "Meow" },
          { id: "f72c89d1-466f-42e0-bbcc-099f2d0fb70d", title: "Moo" },
        ],
      },
    },
    level: "B1",
  },
  {
    id: "0f1f1bfb-846d-45c9-91c7-4d0d9fc9e8b5",
    question: "Which sentence uses the past perfect tense correctly?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        {
          id: "2f3d256a-68f0-4e53-a168-fd6ecb40f9a1",
          title: "I had ate my lunch before she arrived.",
        },
        {
          id: "d9b29a4d-5f3b-4b22-bd03-5d6c7d27bd60",
          title: "I had eaten my lunch before she arrived.",
        },
        {
          id: "3e95f2cd-927d-43dc-9b4f-c4205c2ab3b5",
          title: "I eat my lunch before she arrived.",
        },
      ],
    },
    level: "B1",
  },
];

const QUIZZES_B2 = [
  {
    id: "dc3a8382-91c1-4707-9e94-fd3f76bfc3a1",
    question: "Which of these words is a synonym for 'difficult'?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "a6c3e5a2-84d4-45a9-92eb-1db0a76cc2ee", title: "Easy" },
        { id: "4f3c9302-6d1d-42b2-9a7a-8e1ac8b8c7c1", title: "Challenging" },
        { id: "aa5b0f79-56bd-41f5-b302-bfdd18c8e7b4", title: "Simple" },
      ],
    },
    level: "B2",
  },
  {
    id: "c5f5b1db-0454-42a7-b8db-8e1d5d0c650f",
    question: "If I ___ more time, I would travel the world.",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "1f8c179f-8d5c-4c5c-9fd8-9f50a43e5c19", title: "had" },
        { id: "4a6eb8b0-1f91-4607-8cb6-7cb331aa730a", title: "have" },
        { id: "7dcbde49-01f7-4e35-9d89-5c444d535b7b", title: "has" },
      ],
    },
    level: "B2",
  },
  {
    id: "7ed2a4b7-1d55-44b2-9e0d-9456a6bb9d73",
    question: "Arrange the words to form a correct sentence.",
    type: QuizType.ORDER_WORDS,
    metadata: {
      data: [
        { id: "aa9e5078-8230-4be6-8b50-92e7cd557d21", title: "Although" },
        { id: "1ba859f7-f750-4a59-9f8e-b4c20a2c09a5", title: "it" },
        { id: "e788ba17-d3a3-48df-84e1-43b850a06fd4", title: "was" },
        { id: "e993cc1c-55bd-441f-83bd-7c67be3e2392", title: "raining" },
        { id: "946ddfa4-69e1-49f0-94d6-02d8ef1549a7", title: "they" },
        { id: "fe898c77-abe8-4dd9-9c07-3a0b7988b1f7", title: "went" },
        { id: "c586ec05-c44d-4f1c-91b2-367f350d584f", title: "out" },
      ],
    },
    level: "B2",
  },
  {
    id: "5f40f1b1-3d9a-4716-b76a-9d9f2af2c10c",
    question: "Match the words with their definitions.",
    type: QuizType.MATCH,
    metadata: {
      data: {
        l: [
          { id: "19f4e0d5-27df-4803-b859-5d5d88d9a5f5", title: "Obtain" },
          { id: "d6e99852-6e77-40d9-b264-4c8c7efdd88b", title: "Cease" },
          { id: "c8b2fc28-7b4f-41e4-9b8f-82fb67837ff7", title: "Assist" },
          { id: "f5a5f062-69d7-452d-9c8d-89f5f03e47a5", title: "Expand" },
        ],
        r: [
          { id: "ecfe631b-b9c3-4cc0-bc62-bf5177fcdb1a", title: "Get" },
          { id: "20dce7f0-9a34-41cc-9949-c09f3e3f7e95", title: "Stop" },
          { id: "301d5d7c-7cb0-4ff6-bd34-13d732ec0e4d", title: "Help" },
          { id: "70c23a8e-53d0-4c9d-8eac-76859eae41a9", title: "Enlarge" },
        ],
      },
    },
    level: "B2",
  },
  {
    id: "48d7a2f4-7f7f-4c5d-9e59-f4c88c66f4c6",
    question: "Which sentence is in the passive voice?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        {
          id: "97df7319-d764-40dc-90e7-f407bb46dacc",
          title: "The manager reviewed the report.",
        },
        {
          id: "5b41ba19-b23a-4fa5-8962-16518b2b3c69",
          title: "The report was reviewed by the manager.",
        },
        {
          id: "78e36d6e-6b0a-4723-a6f1-4f6d5aaf8f4e",
          title: "The manager is reviewing the report.",
        },
      ],
    },
    level: "B2",
  },
];

const QUIZZES_C1 = [
  {
    id: "a6b6e8c7-0d43-4d84-8b71-716d61a9ee43",
    question: "I ___ a man at the station.",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "fcba7e36-6072-4b9c-804f-1c5d753cc8a2", title: "meet" },
        { id: "d31e90c5-d247-41d8-95be-3e4231748591", title: "met" },
        { id: "72037d6a-6a8d-4349-b8d2-bbba4c27e6d0", title: "meeting" },
      ],
    },
    level: "C1",
  },
  {
    id: "2a4c235a-78c3-46c2-a9e5-1d4976258c14",
    question: "Which word is closest in meaning to 'elaborate'?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "1a03c346-8583-4c80-8006-688f503c4876", title: "Simple" },
        { id: "f750ca69-7f11-4d5e-a3d9-f5d1d20c4859", title: "Detailed" },
        { id: "3894d0d7-8770-44d0-bb96-c4697b7f5b7c", title: "Fast" },
      ],
    },
    level: "C1",
  },
  {
    id: "3f7927b9-f9f4-4627-b1de-7736a1db1b8e",
    question: "Arrange the words to make a correct sentence.",
    type: QuizType.ORDER_WORDS,
    metadata: {
      data: [
        { id: "e9a7a2e7-0325-49c5-8430-4b2c1c8edc2c", title: "Despite" },
        { id: "9a7be3e7-4f8f-4e36-bfbf-79042f2f20c1", title: "the" },
        { id: "9cf90a39-6fb6-4a97-9b7f-7c0f04c52506", title: "heavy" },
        { id: "c5df36e4-3b4f-4047-9610-8eb27edb68de", title: "rain" },
        { id: "8b8b49d5-3830-4c4f-89b5-70bd6561f711", title: "they" },
        { id: "ff6f64f7-0324-43d7-b71f-0b1ffb9e3a0b", title: "decided" },
        { id: "3c6b12e9-15f2-472d-a1a5-4a4ee4af3a3e", title: "to" },
        { id: "6e6b7965-bb2a-4987-96b5-7af57e3dfd53", title: "go" },
        { id: "10eec19e-3c9e-48b0-8b06-28fc8dcd9a3d", title: "out" },
      ],
    },
    level: "C1",
  },
  {
    id: "f9e54c1e-986e-42df-8a9d-618d5a45cd2d",
    question: "Match the words with their definitions.",
    type: QuizType.MATCH,
    metadata: {
      data: {
        l: [
          { id: "cfc9471d-bf3e-401b-8f62-97c0a5c2939b", title: "Break a leg" },
          { id: "ddcdab68-2c8a-4da8-a94d-2ec47d5f7f9a", title: "Hit the sack" },
          {
            id: "b384ade1-b48d-45d6-b7b6-9e14a60aa3b9",
            title: "Under the weather",
          },
          {
            id: "a1f62262-7f2c-4694-9d30-1df6d97bfab2",
            title: "Piece of cake",
          },
        ],
        r: [
          { id: "41f2c4fc-3a2d-46a1-875e-47b48c70fc47", title: "Good luck" },
          { id: "3c62e262-5d29-46d9-80ad-87290d0410fc", title: "Go to bed" },
          { id: "e9a2b37d-64c4-42ac-8f80-5313831cccf4", title: "Feeling sick" },
          { id: "8b7a7ca3-0dbf-4d64-8f6c-74c2d88d60c2", title: "Very easy" },
        ],
      },
    },
    level: "C1",
  },
  {
    id: "7a12246b-b7a0-4d8c-9263-82d1eb801e33",
    question: "Select the grammatically correct sentence.",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        {
          id: "7983f45d-ff90-4be2-b279-43f8fc8b2ed3",
          title: "She suggested me to apply for the job.",
        },
        {
          id: "f5989dff-fb50-4e5e-b03c-c0b1e0b26f16",
          title: "She suggested that I apply for the job.",
        },
        {
          id: "35fd75b3-bff3-4f90-88fb-c628f6ba6748",
          title: "She suggested to apply for the job.",
        },
      ],
    },
    level: "C1",
  },
];

const QUIZZES_C2 = [
  {
    id: "d118c9c7-77b7-4b45-b35c-2d8772b3f2ac",
    question: "Had I known, I ___ have told you.",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "4c36f5e0-6199-4a4b-b4b6-82c2f50fcb2a", title: "would" },
        { id: "13c2c7c0-8e45-42c3-9c9e-35cf1aaba3a1", title: "will" },
        { id: "775d390d-3f8a-4a87-a83c-3b5c46c11a73", title: "shall" },
      ],
    },
    level: "C2",
  },
  {
    id: "77b8a3fd-6724-4748-b5fb-5158e3a257b4",
    question: "Which one means 'difficult to interpret or understand'?",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        { id: "c3f1ab82-6020-4653-bc4d-3c72f9d34b5b", title: "Lucid" },
        { id: "4e6a90f9-54a7-4b6a-8d20-135ab7475f59", title: "Opaque" },
        { id: "bd85e6a0-5ec3-45f3-872f-b48b5d1d4177", title: "Eloquent" },
      ],
    },
    level: "C2",
  },
  {
    id: "f3c2b5a9-bf33-4d92-a9b6-7f90d632dc67",
    question: "Arrange the words to make a grammatically correct sentence.",
    type: QuizType.ORDER_WORDS,
    metadata: {
      data: [
        { id: "eaac2262-6b64-441b-94f5-70d820ee7da8", title: "No" },
        { id: "e64a38a1-417c-462e-bd35-7813d3425a3e", title: "sooner" },
        { id: "df2a3434-662c-4f9b-9485-4f285a8c737d", title: "had" },
        { id: "3fb2d0ab-273e-4cd5-9db1-4b1ed46a6dd4", title: "I" },
        { id: "5efba9f5-678b-4e63-bd6f-1346816f5f35", title: "arrived" },
        { id: "ed53200e-6f0a-47cb-88c7-6555a44084e5", title: "than" },
        { id: "594a43d8-9960-4669-8579-d423c95a0a59", title: "it" },
        { id: "2f3b8edb-387a-406b-9ae3-9f5087e10f68", title: "started" },
        { id: "e0b56656-bac7-43d9-8058-302ff628f6ba", title: "raining" },
      ],
    },
    level: "C2",
  },
  {
    id: "17d0d12c-27a7-4fd2-8a08-9f18b2b95c97",
    question: "Match the words with their meanings.",
    type: QuizType.MATCH,
    metadata: {
      data: {
        l: [
          { id: "5f8701fa-3fb5-439d-81fc-df6e22a5c23c", title: "Vivid" },
          { id: "d332974f-cad1-4141-b646-947bedbb6f86", title: "Scarce" },
          { id: "84a69b9d-17e5-4e7a-9cb6-b4b9e7d8c9c3", title: "Fragile" },
          { id: "0f0959e7-3cd7-4627-8bd2-0f527d05f14e", title: "Tedious" },
        ],
        r: [
          { id: "64af4ed1-1d0e-4651-89b8-9e4dddefedf9", title: "Very clear" },
          { id: "2aa46a02-3d61-49b7-9757-682b7bf944f0", title: "Hard to find" },
          {
            id: "b3ac0b18-9c65-4422-93b6-cbf3240b3f7e",
            title: "Easily broken",
          },
          { id: "f3340a0b-0f7a-42c7-9fae-1adf240f1b11", title: "Very boring" },
        ],
      },
    },
    level: "C2",
  },
  {
    id: "8ef1b5c6-7f39-4f1d-b8af-6f69f3479864",
    question: "Select the sentence with correct punctuation.",
    type: QuizType.ONE_OPTION,
    metadata: {
      data: [
        {
          id: "1d06b9a1-355c-4603-b54c-f446c17f1505",
          title: "However she decided to stay.",
        },
        {
          id: "c6bb77eb-f7e5-4d38-8e0e-c36a97ab80f7",
          title: "However, she decided to stay.",
        },
        {
          id: "b8790d45-fd86-4db2-9489-6bcf4ef4b294",
          title: "However; she decided to stay.",
        },
      ],
    },
    level: "C2",
  },
];

const QUIZZES_ANSWERS_A1 = {
  "f12db601-0fb3-47b7-aabd-0f4a57f8b7d1": {
    id: "b8ba13e1-91b7-4659-8264-ff8d72f43f16",
  },
  "20ab34ce-2257-4fae-ae9a-0fbba5cb045d": {
    id: "3a6c3b8c-8046-4c63-bf84-17d6c6ab9f16",
  },
  "bfec2b88-7df4-4c3e-8882-18ff8f5a43e1": [
    { id: "6fa5f94a-62be-47c2-8890-8eac3f276f4e", order: 0 },
    { id: "e9d7b7fc-65c1-4d84-8a4d-b19d63443a68", order: 1 },
    { id: "1091cf07-516f-4450-86ec-c064fd2f6afb", order: 2 },
    { id: "a839c4c9-6f23-4f94-bc34-6f6f9b7e2ad1", order: 3 },
  ],
  "7a80d2cb-3081-4ea9-9dc2-67e84a01468b": [
    { id: "37fbdf6c-26c7-4741-9a7d-8c2ac3d2df17", order: 0 },
    { id: "b2f9af51-734e-45a4-8c54-2a6e9db1d0d3", order: 1 },
    { id: "f7c65cb0-9345-4263-9739-1e0f4dfe4c5a", order: 2 },
  ],
  "ea6fcde0-6020-41da-a34f-187dcedc34b5": {
    id: "4d1ba747-52bb-4ef6-bcee-30e8023fa029",
  },
};

const QUIZZES_ANSWERS_A2 = {
  "c4c6d987-19a5-4022-bc18-4c8dc1e4e2fa": {
    id: "996f6fb0-bd1f-487b-910c-5e15f4fa4ed2",
  },
  "f71886d5-1422-43d3-91a7-2f7ccbe779e2": {
    id: "5de6e9c1-8f64-464c-95d0-f63e0c4f9fb9",
  },
  "b8b9e0c9-96e8-4d53-a6d8-b630ef6aa2ec": [
    { id: "2015a208-4f6e-4cc5-b49e-1549f0f7a264", order: 0 },
    { id: "fab8c9d1-5075-4044-8db1-fb4b5a1f8d65", order: 1 },
    { id: "8c7e5d86-c88d-4823-b312-5a0ddcf1dc8b", order: 2 },
    { id: "6f3790fb-5f17-4bfa-92f2-7e6fd73b30d4", order: 3 },
    { id: "ec2b71a0-6895-4539-801f-356b36d58949", order: 4 },
  ],
  "2d56f9b6-3629-463c-9d60-8f2b27af5df4": [
    { id: "be0c4ff1-9370-4f0f-bfcd-fccfdc6890af", order: 0 },
    { id: "5dc6ba33-cd9d-4f1d-9443-1d470ba9c11a", order: 1 },
    { id: "9a29f3f1-515a-4d0f-9349-8c62d249bca7", order: 2 },
  ],
  "e37f0c58-9670-4a7f-91e9-8c7f6e5315e2": {
    id: "6d6c05bb-f6a5-4fd8-865b-85b0b9c1a1ad",
  },
};

const QUIZZES_ANSWERS_B1 = {
  "1f2957c1-bc4d-4e2a-8d65-7342f7c0deed": {
    id: "ad3762c4-9754-4d2d-87e7-760e21dbd065",
  },
  "7fdbf0d3-8729-4cd2-8be0-4cfb4c5780c9": {
    id: "d4b29dfb-7f1d-44f5-8c54-8f3e5d76a1c9",
  },
  "f06668c3-3c2e-4e8a-abc2-96a4b48dc345": [
    { id: "c51e08d2-70f8-419b-ae74-06b2c4573e3c", order: 0 },
    { id: "0d8a1496-861d-4c1f-83f1-2f4143c7d6e5", order: 1 },
    { id: "c47c0320-c25e-4a74-8dc1-0584953ea055", order: 2 },
    { id: "5a2e0e5f-cf9e-4239-b9d8-799cceee0e57", order: 3 },
    { id: "ebfface9-d61d-43f5-a8af-05f47cc18a07", order: 4 },
    { id: "db81d433-4509-4329-91b7-6a01f1a3efec", order: 5 },
  ],
  "4d60710b-57b0-4c93-a507-163dc09b67bd": [
    { id: "9de6d402-bd1e-4b74-85c3-d9d1061edb1c", order: 0 },
    { id: "27e774b3-0a8d-4c9a-8c33-5ef1dba71e0a", order: 1 },
    { id: "f72c89d1-466f-42e0-bbcc-099f2d0fb70d", order: 2 },
  ],
  "0f1f1bfb-846d-45c9-91c7-4d0d9fc9e8b5": {
    id: "d9b29a4d-5f3b-4b22-bd03-5d6c7d27bd60",
  },
};

const QUIZZES_ANSWERS_B2 = {
  "dc3a8382-91c1-4707-9e94-fd3f76bfc3a1": {
    id: "4f3c9302-6d1d-42b2-9a7a-8e1ac8b8c7c1",
  },
  "26a59d84-1c5c-4270-a97f-3b6b35c7b4ed": {
    id: "1f8c179f-8d5c-4c5c-9fd8-9f50a43e5c19",
  },
  "7ed2a4b7-1d55-44b2-9e0d-9456a6bb9d73": [
    { id: "aa9e5078-8230-4be6-8b50-92e7cd557d21", order: 0 },
    { id: "1ba859f7-f750-4a59-9f8e-b4c20a2c09a5", order: 1 },
    { id: "e788ba17-d3a3-48df-84e1-43b850a06fd4", order: 2 },
    { id: "e993cc1c-55bd-441f-83bd-7c67be3e2392", order: 3 },
    { id: "946ddfa4-69e1-49f0-94d6-02d8ef1549a7", order: 4 },
    { id: "fe898c77-abe8-4dd9-9c07-3a0b7988b1f7", order: 5 },
    { id: "c586ec05-c44d-4f1c-91b2-367f350d584f", order: 6 },
  ],
  "5f40f1b1-3d9a-4716-b76a-9d9f2af2c10c": [
    { id: "ecfe631b-b9c3-4cc0-bc62-bf5177fcdb1a", order: 0 },
    { id: "20dce7f0-9a34-41cc-9949-c09f3e3f7e95", order: 1 },
    { id: "301d5d7c-7cb0-4ff6-bd34-13d732ec0e4d", order: 2 },
    { id: "70c23a8e-53d0-4c9d-8eac-76859eae41a9", order: 3 },
  ],
  "48d7a2f4-7f7f-4c5d-9e59-f4c88c66f4c6": {
    id: "5b41ba19-b23a-4fa5-8962-16518b2b3c69",
  },
};

const QUIZZES_ANSWERS_C1 = {
  "a6b6e8c7-0d43-4d84-8b71-716d61a9ee43": {
    id: "d31e90c5-d247-41d8-95be-3e4231748591",
  },
  "2a4c235a-78c3-46c2-a9e5-1d4976258c14": {
    id: "f750ca69-7f11-4d5e-a3d9-f5d1d20c4859",
  },
  "3f7927b9-f9f4-4627-b1de-7736a1db1b8e": [
    { id: "e9a7a2e7-0325-49c5-8430-4b2c1c8edc2c", order: 0 },
    { id: "9a7be3e7-4f8f-4e36-bfbf-79042f2f20c1", order: 1 },
    { id: "9cf90a39-6fb6-4a97-9b7f-7c0f04c52506", order: 2 },
    { id: "c5df36e4-3b4f-4047-9610-8eb27edb68de", order: 3 },
    { id: "8b8b49d5-3830-4c4f-89b5-70bd6561f711", order: 4 },
    { id: "ff6f64f7-0324-43d7-b71f-0b1ffb9e3a0b", order: 5 },
    { id: "3c6b12e9-15f2-472d-a1a5-4a4ee4af3a3e", order: 6 },
    { id: "6e6b7965-bb2a-4987-96b5-7af57e3dfd53", order: 7 },
    { id: "10eec19e-3c9e-48b0-8b06-28fc8dcd9a3d", order: 8 },
  ],
  "f9e54c1e-986e-42df-8a9d-618d5a45cd2d": [
    { id: "41f2c4fc-3a2d-46a1-875e-47b48c70fc47", order: 0 },
    { id: "3c62e262-5d29-46d9-80ad-87290d0410fc", order: 1 },
    { id: "e9a2b37d-64c4-42ac-8f80-5313831cccf4", order: 2 },
    { id: "8b7a7ca3-0dbf-4d64-8f6c-74c2d88d60c2", order: 3 },
  ],
  "7a12246b-b7a0-4d8c-9263-82d1eb801e33": {
    id: "f5989dff-fb50-4e5e-b03c-c0b1e0b26f16",
  },
};

const QUIZZES_ANSWERS_C2 = {
  "d118c9c7-77b7-4b45-b35c-2d8772b3f2ac": {
    id: "4c36f5e0-6199-4a4b-b4b6-82c2f50fcb2a",
  },
  "77b8a3fd-6724-4748-b5fb-5158e3a257b4": {
    id: "4e6a90f9-54a7-4b6a-8d20-135ab7475f59",
  },
  "f3c2b5a9-bf33-4d92-a9b6-7f90d632dc67": [
    { id: "eaac2262-6b64-441b-94f5-70d820ee7da8", order: 0 },
    { id: "e64a38a1-417c-462e-bd35-7813d3425a3e", order: 1 },
    { id: "df2a3434-662c-4f9b-9485-4f285a8c737d", order: 2 },
    { id: "3fb2d0ab-273e-4cd5-9db1-4b1ed46a6dd4", order: 3 },
    { id: "5efba9f5-678b-4e63-bd6f-1346816f5f35", order: 4 },
    { id: "ed53200e-6f0a-47cb-88c7-6555a44084e5", order: 5 },
    { id: "594a43d8-9960-4669-8579-d423c95a0a59", order: 6 },
    { id: "2f3b8edb-387a-406b-9ae3-9f5087e10f68", order: 7 },
    { id: "e0b56656-bac7-43d9-8058-302ff628f6ba", order: 8 },
  ],
  "17d0d12c-27a7-4fd2-8a08-9f18b2b95c97": [
    { id: "64af4ed1-1d0e-4651-89b8-9e4dddefedf9", order: 0 },
    { id: "2aa46a02-3d61-49b7-9757-682b7bf944f0", order: 1 },
    { id: "b3ac0b18-9c65-4422-93b6-cbf3240b3f7e", order: 2 },
    { id: "f3340a0b-0f7a-42c7-9fae-1adf240f1b11", order: 3 },
  ],
  "8ef1b5c6-7f39-4f1d-b8af-6f69f3479864": {
    id: "c6bb77eb-f7e5-4d38-8e0e-c36a97ab80f7",
  },
};
