import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBunnyUrl } from "@/lib/paths";
import {
  cn,
  getLetterBadgeClasses,
  getBlogStatusBadgeClasses,
} from "@/lib/utils";
import {
  EyeIcon,
  TimerIcon,
  MessageSquareIcon,
  ThumbsUpIcon,
  CalendarIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { BlogProps } from "../types";
import Image from "next/image";
import { format } from "date-fns";

const BlogPreviewModal = ({
  blogToPreview,
  setBlogToPreview,
}: {
  blogToPreview: BlogProps;
  setBlogToPreview: Dispatch<SetStateAction<BlogProps | null>>;
}) => {
  const t = useTranslations("BlogsManagement");
  const {
    title,
    excerpt,
    content,
    coverUrl,
    status,
    categories,
    readTime,
    viewCount,
    commentCount,
    publishedAt,
    createdAt,
  } = blogToPreview;

  return (
    <Dialog
      open={true}
      onOpenChange={(e) => {
        if (!e) setBlogToPreview(null);
      }}
    >
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden max-h-[90dvh] flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <EyeIcon strokeWidth={1.75} size={22} />
            {t("blogPreview.title")}
          </DialogTitle>
          <DialogDescription>{t("blogPreview.description")}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6 space-y-5">
            {/* Cover image */}
            <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1657639028182-24e11504c7c1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={title}
                className="object-cover"
                fill
                priority
              />
            </div>

            {/* Title and meta info */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">{title}</h2>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge className={getBlogStatusBadgeClasses(status)}>
                  {status === "published" ? "Published" : "Draft"}
                </Badge>

                <div className="flex items-center gap-1.5">
                  <TimerIcon className="size-3.5" />
                  <span>{readTime} min read</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <ThumbsUpIcon className="size-3.5" />
                  <span>{viewCount} views</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <MessageSquareIcon className="size-3.5" />
                  <span>{commentCount} comments</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="size-3.5" />
                  <span>
                    {publishedAt
                      ? `Published: ${format(new Date(publishedAt), "MMM dd, yyyy")}`
                      : `Created: ${format(new Date(createdAt), "MMM dd, yyyy")}`}
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    className={cn(
                      "capitalize",
                      getLetterBadgeClasses(category)
                    )}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3">Excerpt</h3>
              <p className="text-muted-foreground mb-6">{excerpt}</p>

              <h3 className="text-lg font-semibold mb-3">Content</h3>
              <div className="whitespace-pre-wrap pr-4">{content}</div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPreviewModal;
