import { notFound } from "next/navigation";
import {
  BlogCategory,
  BlogProps,
  BlogStatus,
} from "@/components/data-table/blogs/types";

interface BlogEditPageProps {
  params: {
    slug: string;
  };
}

// Mock function to simulate fetching a blog by slug
const fetchBlogBySlug = async (slug: string): Promise<BlogProps | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // For demonstration purposes, we'll return mock data
  const id = slug.split("-")[1] || "1";
  const isPublished = Math.random() > 0.3;
  const publishedDate = isPublished
    ? new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      ).toISOString()
    : null;

  // Generate random categories
  const allCategories = Object.values(BlogCategory);
  const numCategories = Math.floor(Math.random() * 3) + 1;
  const categories = Array.from({ length: numCategories }).map(
    () => allCategories[Math.floor(Math.random() * allCategories.length)]
  );

  return {
    id,
    title: `Blog Post ${id}: Mastering English ${isPublished ? "Advanced" : "Basic"} Techniques`,
    slug: slug,
    excerpt: `This is an excerpt for blog post ${id}. It contains a brief overview of what this article is about.`,
    content: `This is the full content of blog post ${id}. It would normally contain paragraphs, headers, images, and more.`,
    coverUrl: `cover-${(Number(id) % 5) + 1}.jpg`,
    userId: "user-1",
    status: isPublished ? "published" : "draft",
    publishedAt: publishedDate,
    createdAt: new Date(
      Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000
    ).toISOString(),
    updatedAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    authorFullName: "Author Name",
    authorAvatarUrl: `avatar-${(Number(id) % 5) + 1}.jpg`,
    categories: categories,
    readTime: Math.floor(Math.random() * 20) + 3,
    viewCount: Math.floor(Math.random() * 1000),
    commentCount: Math.floor(Math.random() * 50),
  };
};

// This would typically be a server component that fetches the blog data
export default async function Page({ params }: BlogEditPageProps) {
  const { slug } = params;

  // In a real implementation, you would fetch the blog data from your API/database
  const blogData = await fetchBlogBySlug(slug);

  if (!blogData) return notFound();

  return (
    <div className="mx-auto 2xl:container space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">Edit Blog</h2>
        <p className="text-muted-foreground line-clamp-1">
          Edit your blog post and update its content
        </p>
      </div>

      {/* In a real implementation, you would include your blog editor component here */}
      <div className="border rounded-xl p-6">
        <p className="text-center text-muted-foreground">
          This is a placeholder for the blog editor component. In a real
          implementation, you would include your blog editor component here with
          the blog data pre-filled.
        </p>
        <p className="text-center mt-4">
          You are editing: <strong>{blogData.title}</strong>
        </p>
      </div>
    </div>
  );
}
