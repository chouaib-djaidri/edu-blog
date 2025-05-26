import { PaginationParams, Role, SearchParams } from "@/types/globals";
import { queryOptions } from "@tanstack/react-query";
import { BlogCategory, BlogProps } from "./types";

// Mock function to simulate fetching blogs from an API
const fetchCreatorBlogs = async (
  userId?: string,
  pagination?: PaginationParams,
  search?: SearchParams,
  role?: Role
): Promise<{ data: BlogProps[]; totalCount: number }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Create mock data with different statuses, categories, and metrics
  const mockBlogs: BlogProps[] = Array.from({ length: 20 }).map((_, index) => {
    const id = `blog-${index + 1}`;
    const isPublished = index % 3 !== 0; // 2/3 published, 1/3 draft
    const publishedDate = isPublished 
      ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() 
      : null;
    
    // Generate random categories
    const allCategories = Object.values(BlogCategory);
    const numCategories = Math.floor(Math.random() * 3) + 1;
    const categories = Array.from({ length: numCategories }).map(() => 
      allCategories[Math.floor(Math.random() * allCategories.length)]
    );
    
    return {
      id,
      title: `Blog Post ${index + 1}: Mastering English ${isPublished ? "Advanced" : "Basic"} Techniques`,
      slug: `blog-post-${index + 1}-mastering-english-techniques`,
      excerpt: `This is an excerpt for blog post ${index + 1}. It contains a brief overview of what this article is about.`,
      content: `This is the full content of blog post ${index + 1}. It would normally contain paragraphs, headers, images, and more.`,
      coverUrl: `cover-${index % 5 + 1}.jpg`,
      userId: userId || "user-1",
      status: isPublished ? "published" : "draft",
      publishedAt: publishedDate,
      createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      authorFullName: role === Role.ADMIN ? `Author ${index % 5 + 1}` : null,
      authorAvatarUrl: role === Role.ADMIN ? `avatar-${index % 5 + 1}.jpg` : null,
      categories: categories,
      readTime: Math.floor(Math.random() * 20) + 3,
      viewCount: Math.floor(Math.random() * 1000),
      commentCount: Math.floor(Math.random() * 50),
    };
  });

  // Apply filtering based on search parameters
  let filteredBlogs = [...mockBlogs];
  
  if (search?.searchTerm) {
    const term = search.searchTerm.toLowerCase();
    filteredBlogs = filteredBlogs.filter(blog => 
      blog.title.toLowerCase().includes(term) || 
      blog.excerpt.toLowerCase().includes(term)
    );
  }
  
  if (search?.status) {
    filteredBlogs = filteredBlogs.filter(blog => 
      search.status?.includes(blog.status)
    );
  }
  
  if (search?.categories) {
    filteredBlogs = filteredBlogs.filter(blog => 
      blog.categories.some(cat => search.categories?.includes(cat))
    );
  }

  // Apply pagination
  const pageSize = pagination?.pageSize || 10;
  const page = pagination?.page || 0;
  const paginatedBlogs = filteredBlogs.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  return {
    data: paginatedBlogs,
    totalCount: filteredBlogs.length,
  };
};

export const blogsQueries = {
  all: ["blogs"],
  list: (
    userId?: string,
    pagination?: PaginationParams,
    search?: SearchParams,
    role?: Role
  ) =>
    queryOptions({
      queryKey: [...blogsQueries.all, "list", pagination, search],
      queryFn: () => fetchCreatorBlogs(userId, pagination, search, role),
      staleTime: 5 * 60 * 1000,
    }),
};
