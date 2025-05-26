import EffectIcon from "@/assets/icons/effect-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user";
import { getBunnyUrl, getPreview } from "@/lib/paths";
import { getLetterBadgeClasses, getLevelBadgeClasses } from "@/lib/utils";
import { EnglishLevel } from "@/types/globals";
import { formatDistanceToNow } from "date-fns";
import { MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const CoursesSection = () => {
  const t = useTranslations("HomePage.blogs");
  const tb = useTranslations("Buttons");

  const { userData } = useUser();
  const fallback = userData?.fullName?.[0] || "U";
  const avatarUrl = getPreview(userData?.avatarUrl || "", "avatars");

  return (
    <section id="courses" className="bg-muted py-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center px-6">
        <div className="text-center flex flex-col items-center gap-2">
          <div className="relative text-primary w-fit">
            <EffectIcon className="size-7 absolute -start-8 -top-4" />
            <EffectIcon className="size-7 absolute -end-8 -top-4" />
            <Badge className="px-6 pt-2 pb-1.5 bg-primary text-white border-0 text-sm">
              <div className="flex justify-center items-center size-4.5">
                <Image
                  src={`/icons/lightning.png`}
                  alt=""
                  width={512}
                  height={512}
                  className="size-4.5"
                />
              </div>
              {t("tag")}
            </Badge>
          </div>
          <h2 className="font-semibold text-3xl sm:text-4xl">{t("title")}</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <div className="w-full mt-8 text-start grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center rounded-xl overflow-hidden bg-accent mt-12 shadow-lg">
            <div className="aspect-[3/2] bg-accent flex-1 w-full">
              <Image
                src={getBunnyUrl(
                  `blog-covers/00449843-6769-4731-9c70-5957c0972eef.png`
                )}
                className="w-full object-cover"
                alt=""
                width={1500}
                height={1000}
              />
            </div>
            <div className="p-6 flex flex-col gap-4 flex-1">
              <div className="flex justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  <Badge className={getLevelBadgeClasses(EnglishLevel.A1)}>
                    {EnglishLevel.A1} Level
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
                  Reclaiming Your Time in a Hyperconnected
                </h3>
                <p className="text-muted-foreground line-clamp-3">
                  In a world overflowing with notifications, screen time, and
                  digital distractions, digital minimalism offers a refreshing
                  way to regain control.
                </p>
              </div>

              <div className="flex justify-between items-center gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <Avatar className="size-7">
                    {avatarUrl && (
                      <AvatarImage src={avatarUrl} alt="user avatar" />
                    )}
                    <AvatarFallback className="border-2 border-background">
                      {fallback}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-muted-foreground">
                    {userData?.fullName}
                  </p>
                </div>
                <p className="text-muted-foreground first-letter:uppercase">
                  {formatDistanceToNow(new Date())}
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
          {/* <p className="text-muted-foreground text-center">
            {t("emptyResult")}
          </p> */}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
