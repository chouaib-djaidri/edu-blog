import Wrapper from "@/app/[locale]/(dashboard)/add-new-test/_components/wrapper";
import { normalizeTest } from "@/lib/normalizations";
import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface TestPostPageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: TestPostPageProps) {
  const { slug } = await params;
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("tests_with_profiles")
    .select("")
    .eq("slug", slug)
    .single();
  console.log("####### ", error?.message);
  if (!data) return notFound();

  const testData = normalizeTest(data);
  return (
    <Wrapper
      defaultValues={{
        categories: testData.categories,
        coverFile: testData.coverUrl,
        description: testData.description,
        level: testData.level,
        quizzes: testData.questions,
        title: testData.title,
        id: testData.id,
      }}
    />
  );
}
