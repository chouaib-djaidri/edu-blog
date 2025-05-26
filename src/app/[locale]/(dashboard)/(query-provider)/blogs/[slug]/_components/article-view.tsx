/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import EffectIcon from "@/assets/icons/effect-icon";
import PressedButton from "@/components/buttons/pressed-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExtraTextBlank } from "@/components/ui/text-blank";
import { cn, getLetterBadgeClasses, getLevelBadgeClasses } from "@/lib/utils";
import { OneOptionMetadata, QuizType } from "@/types/globals";
import { format } from "date-fns";
import { Flame } from "lucide-react";
import Image from "next/image";
import { CommentSection } from "./comments";
import { TracingBeam } from "./tracing-beam";

interface ArticleViewProps {
  article: any;
}

const quiz = {
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
};

export function ArticleView({ article }: ArticleViewProps) {
  // const { userData } = useUser();
  // const supabase = supabaseClient();

  // State management
  // const [isLiked, setIsLiked] = useState(false);
  // const [isFavorited, setIsFavorited] = useState(false);
  // const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  // Check if the user has favorited this blog post on component mount
  // useEffect(() => {
  //   if (!userData || !article.id) {
  //     setIsLoadingFavorite(false);
  //     return;
  //   }

  //   const checkFavoriteStatus = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from("user_favorite_blogs")
  //         .select("id")
  //         .eq("blog_id", article.id)
  //         .eq("user_id", userData.id)
  //         .maybeSingle();

  //       if (error && error.code !== "PGRST116") {
  //         // PGRST116 is "not found" error
  //         throw error;
  //       }

  //       setIsFavorited(!!data);
  //     } catch (error) {
  //       console.error("Error checking favorite status:", error);
  //       // Don't show error toast for initial load, just log it
  //     } finally {
  //       setIsLoadingFavorite(false);
  //     }
  //   };

  //   checkFavoriteStatus();
  // }, [article.id, userData, supabase]);

  // Handle toggling favorite status with optimistic updates
  // const handleFavoriteBlog = async () => {
  //   if (!userData) {
  //     toast.error("Please log in to favorite this article");
  //     return;
  //   }

  //   const wasAlreadyFavorited = isFavorited;

  //   // Optimistic update - immediately change the UI
  //   setIsFavorited(!wasAlreadyFavorited);

  //   // Show immediate feedback without processing state
  //   const optimisticToast = wasAlreadyFavorited
  //     ? toast.success("Removed from favorites")
  //     : toast.success("Added to favorites");

  //   try {
  //     if (wasAlreadyFavorited) {
  //       // Remove from favorites
  //       const { error } = await supabase
  //         .from("user_favorite_blogs")
  //         .delete()
  //         .eq("blog_id", article.id)
  //         .eq("user_id", userData.id);

  //       if (error) throw error;
  //     } else {
  //       // Add to favorites
  //       const { error } = await supabase.from("user_favorite_blogs").insert({
  //         blog_id: article.id,
  //         user_id: userData.id,
  //       });

  //       if (error) {
  //         // Check if it's a duplicate key error (user somehow already favorited)
  //         if (error.code === "23505") {
  //           // Unique constraint violation - item was already favorited
  //           setIsFavorited(true); // Ensure UI shows favorited state
  //           return;
  //         }
  //         throw error;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating favorite status:", error);

  //     // Revert optimistic update on error
  //     setIsFavorited(wasAlreadyFavorited);

  //     // Dismiss the optimistic toast and show error
  //     toast.dismiss(optimisticToast);

  //     // Show appropriate error message
  //     const actionText = wasAlreadyFavorited ? "remove from" : "add to";
  //     toast.error(error.message || `Failed to ${actionText} favorites`);
  //   }
  // };

  // Handle liking a blog (placeholder for future implementation)
  // const handleLikeBlog = async () => {
  //   if (!userData) {
  //     toast.error("Please log in to like this article");
  //     return;
  //   }

  //   // Optimistic update for likes (no database table yet)
  //   setIsLiked((prev) => !prev);
  //   toast.success(isLiked ? "Removed like" : "Liked article!");

  //   // TODO: Implement actual like functionality with database
  //   // This would work similarly to favorites with a user_blog_likes table
  // };

  return (
    <div className="container mx-auto max-w-5xl relative">
      <TracingBeam>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              <Badge className={getLevelBadgeClasses(article.level)}>
                {article.level} Level
              </Badge>
              {article.category.map((el) => (
                <Badge key={el} className={getLetterBadgeClasses(el)}>
                  {el}
                </Badge>
              ))}
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">{article.title}</h1>
            <div className="flex items-center gap-2 font-medium text-muted-foreground -mt-1.5">
              <div className="flex justify-center items-center size-5 mt-0.5">
                <Image
                  src={`/icons/date.png`}
                  alt=""
                  width={512}
                  height={512}
                  className="size-5"
                />
              </div>
              <span className="leading-1">
                {format(article.publishedAt, "MMMM dd, yyyy 'at' HH:mm")}{" "}
              </span>
            </div>
          </div>
          {article.coverImage && (
            <img
              src={article.coverImage || "/placeholder.svg"}
              alt={article.title}
              className="h-[300px] w-full rounded-xl object-cover md:h-[400px]"
            />
          )}
          <TravelBlogContent />
          <div className="border px-6 pt-12 pb-12 rounded-xl">
            <div className="mb-4 flex justify-center">
              <div className="relative text-orange-700">
                <EffectIcon className="size-7 absolute -start-8 -top-4" />
                <EffectIcon className="size-7 absolute -end-8 -top-4" />
                <Badge className="px-6 pt-2 pb-1.5 bg-orange-700 text-white border-0 text-sm">
                  <span className="inline-flex pb-0.5">
                    <Flame className="size-4.5" />
                  </span>
                  Challenge
                </Badge>
              </div>
            </div>
            <div className="w-full h-full max-w-md mx-auto flex items-center justify-center flex-col gap-6">
              <h3 className="text-lg font-semibold">
                <ExtraTextBlank text={quiz.question} />
              </h3>
              <div className="grid gap-y-1.5 max-w-sm min-w-52">
                {(quiz.metadata as OneOptionMetadata).data.map(
                  ({ id: itemId, title }) => {
                    return (
                      <PressedButton
                        key={itemId}
                        className={cn(
                          "whitespace-normal px-12 overflow-hidden"
                        )}
                        variant={"default"}
                        rounded="2xl"
                      >
                        {title}
                      </PressedButton>
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 pt-6 border-t w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn("transition-colors")}
              >
                <div className="flex justify-center items-center size-5">
                  <Image
                    src={`/icons/heart.png`}
                    alt=""
                    width={512}
                    height={512}
                    className="size-5"
                  />
                </div>
                <span className="leading-1 ps-px">{article.stats.likes}</span>
                Likes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn("transition-colors")}
              >
                <div className="flex justify-center items-center size-5">
                  <Image
                    src={`/icons/chat.png`}
                    alt=""
                    width={512}
                    height={512}
                    className="size-5"
                  />
                </div>
                <span className="leading-1 ps-px">
                  {article.stats.comments}
                </span>
                Comments
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={cn("transition-colors")}
            >
              <div className="flex justify-center items-center size-4.5">
                <Image
                  src={`/icons/bookmark.png`}
                  alt=""
                  width={512}
                  height={512}
                  className="size-4.5"
                />
              </div>
              <span className="leading-1 ps-px">Save Blog</span>
            </Button>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-semibold">Comments</h3>
            <CommentSection blogId={article.id} className="w-full" />
          </div>
        </div>
      </TracingBeam>
    </div>
  );
}

const TravelBlogContent = () => {
  return (
    <div className="prose prose-lg max-w-none text-base grid gap-3">
      <p className="text-gray-700 leading-relaxed">
        Traveling doesn't have to cost a fortune! 💰 With smart planning and an
        open mind, you can discover amazing places without spending too much
        money. Today, I'll share some practical tips that have helped me explore
        hidden gems around the world while staying within my budget. ✈️
      </p>
      <h2 className="text-xl font-bold text-gray-900 mt-2">
        🗺️ What Are Hidden Gems?
      </h2>
      <p className="leading-relaxed">
        Hidden gems are{" "}
        <strong className="text-indigo-700">
          special places that most tourists don't know about
        </strong>
        . These might be small villages, quiet beaches, local restaurants, or
        beautiful viewpoints. They offer authentic experiences that you won't
        find in guidebooks or crowded tourist areas.
      </p>
      <blockquote className="border-l-4 border-indigo-600 text-indigo-900 bg-indigo-50 p-4 mt-2">
        "The real voyage of discovery consists not in seeking new landscapes,
        but in having new eyes." -{" "}
        <span className="font-semibold">Marcel Proust</span>
      </blockquote>
    </div>
  );
};
