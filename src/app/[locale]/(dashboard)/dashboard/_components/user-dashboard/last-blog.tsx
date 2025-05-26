import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLetterBadgeClasses, getLevelBadgeClasses } from "@/lib/utils";
import { EnglishLevel } from "@/types/globals";
import { formatDistanceToNow } from "date-fns";
import { MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const LastBlog = () => {
  const tb = useTranslations("Buttons");
  return (
    <Card className="gap-6">
      <div className="flex items-center justify-between px-6 shrink-0 gap-6 w-full">
        <CardHeader className="flex-1 px-0 gap-0.5">
          <CardTitle className="text-lg">Last Blog You Read</CardTitle>
          <CardDescription>
            Check out the most recent blog you explored and revisit it anytime.
          </CardDescription>
        </CardHeader>
      </div>
      <CardContent>
        <div className="flex flex-col items-center rounded-xl overflow-hidden border">
          <div className="p-6 flex flex-col gap-4 flex-1">
            <div className="flex justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                <Badge className={getLevelBadgeClasses(EnglishLevel.B1)}>
                  {EnglishLevel.B1} Level
                </Badge>
                <Badge className={getLetterBadgeClasses("T")}>Travel</Badge>
              </div>
              <div className="flex justify-center items-center size-6">
                <Image
                  src={`/icons/bookmark.png`}
                  alt=""
                  width={512}
                  height={512}
                  className="size-6 grayscale-100 transition-all hover:grayscale-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Exploring Hidden Gems: Travel Smart on a Budget
              </h3>
              <p className="text-muted-foreground line-clamp-3">
                Discover practical tips for finding unique destinations,
                affordable stays, and unforgettable experiences without breaking
                the bank. Perfect for adventurous travelers seeking authentic
                journeys.
              </p>
            </div>

            <div className="flex justify-between items-center gap-4 mt-1">
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarImage
                    src={
                      "https://lh3.googleusercontent.com/a/ACg8ocI2v5WwT8Sg1RE5j1gsdp3Tn91BM51gd566tFe8Pa_lo9_MPtQ=s393-c-no"
                    }
                    alt="user avatar"
                  />
                  <AvatarFallback className="border-2 border-background">
                    C
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium text-muted-foreground">
                  Chouaib Djaidri
                </p>
              </div>
              <p className="text-muted-foreground first-letter:uppercase">
                {formatDistanceToNow("2025-05-24T21:05:00+00:00")}
              </p>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-base">
                    <div className="flex justify-center items-center size-6">
                      <Image
                        src={`/icons/heart.png`}
                        alt=""
                        width={512}
                        height={512}
                        className="size-6"
                      />
                    </div>
                    <span className="leading-1">15</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-muted-foreground text-base">
                    <div className="flex justify-center items-center size-5.5">
                      <Image
                        src={`/icons/chat.png`}
                        alt=""
                        width={512}
                        height={512}
                        className="size-5.5"
                      />
                    </div>
                    <span className="leading-1">8</span>
                  </div>
                </div>
                <Button className="w-fit" variant="link" asChild>
                  <Link href={`#`}>
                    {tb("readMore")}
                    <MoveRight className="size-4.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastBlog;
