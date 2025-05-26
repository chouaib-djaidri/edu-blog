import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getLetterBadgeClasses, getLevelBadgeClasses } from "@/lib/utils";
import { EnglishLevel } from "@/types/globals";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDown01,
  ArrowUp01,
  MoveRight,
  SearchIcon,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const BlogsData = [
  {
    id: "1",
    title: "Exploring Hidden Gems: Travel Smart on a Budget",
    description:
      "Discover practical tips for finding unique destinations, affordable stays, and unforgettable experiences without breaking the bank. Perfect for adventurous travelers seeking authentic journeys.",
    coverImage:
      "https://tripjive.com/wp-content/uploads/2024/03/Hidden-gems-and-underrated-places-to-visit-in-the-US.jpg",
    level: "B1",
    category: ["Travel"],
    categoryLetter: "T",
    author: {
      name: "Chouaib Djaidri",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocI2v5WwT8Sg1RE5j1gsdp3Tn91BM51gd566tFe8Pa_lo9_MPtQ=s393-c-no",
      initials: "C",
    },
    publishedAt: "2025-05-24T21:05:00+00:00",
    stats: {
      likes: 15,
      comments: 8,
    },
    isBookmarked: false,
  },
  {
    id: "2",
    title: "Building Confidence in Job Interviews: Your Success Guide",
    description:
      "Master the art of job interviews with proven strategies and practical advice. Learn how to present yourself professionally, answer difficult questions, and make a lasting impression on potential employers.",
    coverImage:
      "https://img.freepik.com/premium-photo/woman-with-green-leaf-her-head_867653-41.jpg",
    level: "B1",
    category: ["Career", "Business"],
    author: {
      name: "James Wilson",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      initials: "J",
    },
    publishedAt: "2025-05-23T14:30:00+00:00",
    stats: {
      likes: 28,
      comments: 12,
    },
    isBookmarked: true,
  },
  {
    id: "3",
    title: "Mastering Digital Minimalism: Reclaim Your Focus",
    description:
      "In a world of endless notifications and digital clutter, learn how to simplify your online life, reduce screen time, and reconnect with what truly matters. A mindful guide for modern learners.",
    coverImage:
      "https://news.ubc.ca/wp-content/uploads/2023/08/AdobeStock_559145847-1024x682.jpeg",
    level: "B1",
    category: ["Self-Development"],
    author: {
      name: "Ahmed Carter",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
      initials: "A",
    },
    publishedAt: "2025-05-22T18:15:00+00:00",
    stats: {
      likes: 21,
      comments: 5,
    },
    isBookmarked: false,
  },
];

const BlogsPage = () => {
  const tb = useTranslations("Buttons");
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold">Explore Blogs</h2>
        <p className="text-muted-foreground line-clamp-1">
          Dive into a world of engaging articles, insightful guides, and fresh
          ideas. Browse topics you love or discover something completely new.
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <Input
            // ref={inputRef}
            className={cn(
              "peer w-full ps-9"
              //   Boolean(table.getColumn("title")?.getFilterValue()) && "pe-9"
            )}
            // value={(table.getColumn("title")?.getFilterValue() ?? "") as string}
            // onChange={(e) =>
            //   table.getColumn("title")?.setFilterValue(e.target.value)
            // }
            placeholder={"Search by title..."}
            type="text"
            // aria-label={t("search.title.label")}
          />
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <SearchIcon className="size-4.5" aria-hidden="true" />
          </div>
          {/* {Boolean(table.getColumn("title")?.getFilterValue()) && (
                    <button
                      className="text-muted-foreground hover:text-foreground focus-visible:border-ring focus-visible:ring-ring absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={t("clearFilter")}
                      onClick={() => {
                        table.getColumn("title")?.setFilterValue("");
                        if (inputRef.current) {
                          inputRef.current.focus();
                        }
                      }}
                    >
                      <CircleXIcon
                        className="size-4.5"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </button>
                  )} */}
        </div>
        <Select defaultValue="1">
          <SelectTrigger className="ps-4.5 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
            <SelectValue placeholder="Select sort type" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
            <SelectItem value="1">
              <ArrowUp01 size={16} aria-hidden="true" />
              <span className="truncate">Sort By New</span>
            </SelectItem>
            <SelectItem value="2">
              <ArrowDown01 size={16} aria-hidden="true" />
              <span className="truncate">Sort By Old</span>
            </SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="max-lg:size-11 h-11 max-lg:p-0 shrink-0"
            >
              <Star className="lg:-ms-1 size-4.5" aria-hidden="true" />
              <span className="max-lg:hidden">Level</span>

              <span className="bg-primary text-primary-foreground -me-1 ms-1 inline-flex h-5 max-h-full items-center rounded px-1.5 text-[0.625rem] font-medium max-lg:hidden">
                {1}
              </span>

              {/* {levelFilters.length > 0 && (
                        <span className="bg-primary text-primary-foreground -me-1 ms-1 inline-flex h-5 max-h-full items-center rounded px-1.5 text-[0.625rem] font-medium max-lg:hidden">
                          {levelFilters.length}
                        </span>
                      )} */}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto min-w-36 max-lg:max-w-46 p-4"
            align="end"
          >
            <div className="space-y-2.5">
              <div className="font-medium">Filter by level</div>
              <div className="flex flex-wrap gap-1">
                {Object.keys(EnglishLevel).map((value) => (
                  <div key={value} className="flex items-center gap-2">
                    <Label className="flex grow justify-between gap-2 font-normal">
                      {/* <Checkbox
                                checked={levelFilters.includes(value)}
                                onCheckedChange={() => toggleLevel(value)}
                                className="sr-only"
                              /> */}
                      <Badge
                        className={cn(
                          "cursor-pointer leading-[18px]",
                          getLevelBadgeClasses(value)
                          //   levelFilters.includes(value)
                          //     ? "opacity-100"
                          //     : "opacity-50"
                        )}
                      >
                        {value} Level
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {BlogsData.map((blog) => (
          <div key={blog.id} className="flex flex-col shadow-md rounded-xl">
            <div className="aspect-[3/2] bg-accent flex-1 overflow-hidden rounded-t-xl shrink-0">
              <img
                src={blog.coverImage}
                className="size-full object-cover"
                alt={blog.title}
                width={1500}
                height={1000}
              />
            </div>
            <div className="p-4.5 flex flex-col justify-center gap-3 border border-t-0 border-border/50 rounded-b-xl">
              <div className="flex justify-between gap-4">
                <div className="flex flex-wrap gap-1">
                  <Badge className={getLevelBadgeClasses(blog.level)}>
                    {blog.level} Level
                  </Badge>
                  {blog.category.map((el) => (
                    <Badge key={el} className={getLetterBadgeClasses(el)}>
                      {el}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-center items-center size-5">
                  <Image
                    src={`/icons/bookmark.png`}
                    alt=""
                    width={512}
                    height={512}
                    className={cn(
                      "size-5 transition-all hover:grayscale-10",
                      blog.isBookmarked ? "grayscale-0" : "grayscale-100"
                    )}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold line-clamp-1">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2">
                  {blog.description}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center gap-4 mt-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarImage
                        src={blog.author.avatar}
                        alt={`${blog.author.name} avatar`}
                      />
                      <AvatarFallback className="border-2 border-background">
                        {blog.author.initials}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-muted-foreground">{blog.author.name}</p>
                  </div>
                  <p className="text-muted-foreground first-letter:uppercase">
                    {formatDistanceToNow(blog.publishedAt)}
                  </p>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1 font-medium text-muted-foreground text-base">
                        <div className="flex justify-center items-center size-5">
                          <Image
                            src={`/icons/heart.png`}
                            alt=""
                            width={512}
                            height={512}
                            className="size-5"
                          />
                        </div>
                        <span className="leading-1">{blog.stats.likes}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium text-muted-foreground text-base">
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
                          {blog.stats.comments}
                        </span>
                      </div>
                    </div>
                    <Button className="w-fit" variant="link" asChild>
                      <Link href={`/blogs/${blog.id}`}>
                        {tb("readMore")}
                        <MoveRight className="size-4.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
